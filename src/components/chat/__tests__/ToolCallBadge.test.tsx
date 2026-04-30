import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallBadge, getActionLabel } from "../ToolCallBadge";

afterEach(() => {
  cleanup();
});

// ---------------------------------------------------------------------------
// getActionLabel unit tests (pure function, no rendering needed)
// ---------------------------------------------------------------------------

test("getActionLabel: str_replace_editor create", () => {
  expect(getActionLabel("str_replace_editor", { command: "create", path: "/App.jsx" })).toBe("Creating App.jsx");
});

test("getActionLabel: str_replace_editor str_replace", () => {
  expect(getActionLabel("str_replace_editor", { command: "str_replace", path: "/src/Card.jsx" })).toBe("Editing Card.jsx");
});

test("getActionLabel: str_replace_editor insert", () => {
  expect(getActionLabel("str_replace_editor", { command: "insert", path: "/src/Card.jsx" })).toBe("Editing Card.jsx");
});

test("getActionLabel: str_replace_editor view", () => {
  expect(getActionLabel("str_replace_editor", { command: "view", path: "/App.jsx" })).toBe("Reading App.jsx");
});

test("getActionLabel: str_replace_editor undo_edit", () => {
  expect(getActionLabel("str_replace_editor", { command: "undo_edit", path: "/App.jsx" })).toBe("Undoing edit in App.jsx");
});

test("getActionLabel: str_replace_editor unknown command falls back to Working on", () => {
  expect(getActionLabel("str_replace_editor", { command: "unknown", path: "/App.jsx" })).toBe("Working on App.jsx");
});

test("getActionLabel: file_manager rename", () => {
  expect(
    getActionLabel("file_manager", { command: "rename", path: "/old.jsx", new_path: "/new.jsx" })
  ).toBe("Renaming old.jsx to new.jsx");
});

test("getActionLabel: file_manager delete", () => {
  expect(getActionLabel("file_manager", { command: "delete", path: "/config.json" })).toBe("Deleting config.json");
});

test("getActionLabel: file_manager unknown command falls back to Managing", () => {
  expect(getActionLabel("file_manager", { command: "unknown", path: "/config.json" })).toBe("Managing config.json");
});

test("getActionLabel: unknown toolName returns raw toolName", () => {
  expect(getActionLabel("some_other_tool", { path: "/foo.js" })).toBe("some_other_tool");
});

test("getActionLabel: missing args defaults filename to 'file'", () => {
  expect(getActionLabel("str_replace_editor", {})).toBe("Working on file");
});

test("getActionLabel: path with no slashes uses full value as filename", () => {
  expect(getActionLabel("str_replace_editor", { command: "create", path: "App.jsx" })).toBe("Creating App.jsx");
});

// ---------------------------------------------------------------------------
// ToolCallBadge component rendering tests
// ---------------------------------------------------------------------------

test("ToolCallBadge: renders label text", () => {
  render(
    <ToolCallBadge
      toolInvocation={{ toolName: "str_replace_editor", state: "call", args: { command: "create", path: "/App.jsx" } }}
    />
  );
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
});

test("ToolCallBadge: shows spinner when state is 'call'", () => {
  const { container } = render(
    <ToolCallBadge
      toolInvocation={{ toolName: "str_replace_editor", state: "call", args: { command: "create", path: "/App.jsx" } }}
    />
  );
  expect(container.querySelector(".animate-spin")).toBeTruthy();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

test("ToolCallBadge: shows spinner when state is 'partial-call'", () => {
  const { container } = render(
    <ToolCallBadge
      toolInvocation={{ toolName: "str_replace_editor", state: "partial-call", args: { command: "create", path: "/App.jsx" } }}
    />
  );
  expect(container.querySelector(".animate-spin")).toBeTruthy();
});

test("ToolCallBadge: shows green dot when state is 'result' with truthy result", () => {
  const { container } = render(
    <ToolCallBadge
      toolInvocation={{ toolName: "str_replace_editor", state: "result", args: { command: "create", path: "/App.jsx" }, result: "Success" }}
    />
  );
  expect(container.querySelector(".bg-emerald-500")).toBeTruthy();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("ToolCallBadge: shows spinner when state is 'result' with falsy result", () => {
  const { container } = render(
    <ToolCallBadge
      toolInvocation={{ toolName: "str_replace_editor", state: "result", args: { command: "create", path: "/App.jsx" }, result: undefined }}
    />
  );
  expect(container.querySelector(".animate-spin")).toBeTruthy();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

test("ToolCallBadge: handles missing args without crashing", () => {
  render(
    <ToolCallBadge
      toolInvocation={{ toolName: "str_replace_editor", state: "call" }}
    />
  );
  expect(screen.getByText("Working on file")).toBeDefined();
});

test("ToolCallBadge: renders file_manager delete label", () => {
  render(
    <ToolCallBadge
      toolInvocation={{ toolName: "file_manager", state: "call", args: { command: "delete", path: "/config.json" } }}
    />
  );
  expect(screen.getByText("Deleting config.json")).toBeDefined();
});

test("ToolCallBadge: renders file_manager rename label", () => {
  render(
    <ToolCallBadge
      toolInvocation={{ toolName: "file_manager", state: "result", args: { command: "rename", path: "/old.jsx", new_path: "/new.jsx" }, result: { success: true } }}
    />
  );
  expect(screen.getByText("Renaming old.jsx to new.jsx")).toBeDefined();
});

test("ToolCallBadge: unknown toolName renders raw tool name", () => {
  render(
    <ToolCallBadge
      toolInvocation={{ toolName: "custom_tool", state: "call", args: {} }}
    />
  );
  expect(screen.getByText("custom_tool")).toBeDefined();
});
