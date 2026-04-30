"use client";

import { Loader2 } from "lucide-react";

interface ToolCallBadgeProps {
  toolInvocation: {
    toolName: string;
    state: "partial-call" | "call" | "result";
    args?: Record<string, unknown>;
    result?: unknown;
  };
}

function getFileName(path: unknown): string {
  if (typeof path !== "string" || !path) return "file";
  return path.split("/").filter(Boolean).pop() ?? "file";
}

export function getActionLabel(
  toolName: string,
  args: Record<string, unknown> = {}
): string {
  const filename = getFileName(args.path);
  const command = args.command as string | undefined;

  if (toolName === "str_replace_editor") {
    switch (command) {
      case "create":
        return `Creating ${filename}`;
      case "str_replace":
        return `Editing ${filename}`;
      case "insert":
        return `Editing ${filename}`;
      case "view":
        return `Reading ${filename}`;
      case "undo_edit":
        return `Undoing edit in ${filename}`;
      default:
        return `Working on ${filename}`;
    }
  }

  if (toolName === "file_manager") {
    switch (command) {
      case "rename": {
        const newFilename = getFileName(args.new_path);
        return `Renaming ${filename} to ${newFilename}`;
      }
      case "delete":
        return `Deleting ${filename}`;
      default:
        return `Managing ${filename}`;
    }
  }

  return toolName;
}

export function ToolCallBadge({ toolInvocation }: ToolCallBadgeProps) {
  const { state, toolName, args, result } = toolInvocation;
  const isCompleted = state === "result" && result != null;
  const label = getActionLabel(toolName, args);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {isCompleted ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600 flex-shrink-0" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
