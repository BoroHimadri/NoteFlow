"use client";

import { type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
} from "lucide-react";

import { Toggle } from "../ui/toggle";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

interface ToolbarProps {
  editor: Editor | null;
}

export default function EditorToolbar({ editor }: ToolbarProps) {
  if (!editor) return null;

  const tools = [
    {
      group: [
        {
          icon: Heading2,
          label: "Heading 2",
          active: editor.isActive("heading", { level: 2 }),
          action: () =>
            editor.chain().focus().toggleHeading({ level: 2 }).run(),
        },
        {
          icon: Heading3,
          label: "Heading 3",
          active: editor.isActive("heading", { level: 3 }),
          action: () =>
            editor.chain().focus().toggleHeading({ level: 3 }).run(),
        },
      ],
    },
    {
      group: [
        {
          icon: Bold,
          label: "Bold",
          active: editor.isActive("bold"),
          action: () => editor.chain().focus().toggleBold().run(),
        },
        {
          icon: Italic,
          label: "Italic",
          active: editor.isActive("italic"),
          action: () => editor.chain().focus().toggleItalic().run(),
        },
        {
          icon: Strikethrough,
          label: "Strikethrough",
          active: editor.isActive("strike"),
          action: () => editor.chain().focus().toggleStrike().run(),
        },
        {
          icon: Code,
          label: "Inline code",
          active: editor.isActive("code"),
          action: () => editor.chain().focus().toggleCode().run(),
        },
      ],
    },
    {
      group: [
        {
          icon: List,
          label: "Bullet list",
          active: editor.isActive("bulletList"),
          action: () => editor.chain().focus().toggleBulletList().run(),
        },
        {
          icon: ListOrdered,
          label: "Ordered list",
          active: editor.isActive("orderedList"),
          action: () => editor.chain().focus().toggleOrderedList().run(),
        },
        {
          icon: Quote,
          label: "Blockquote",
          active: editor.isActive("blockquote"),
          action: () => editor.chain().focus().toggleBlockquote().run(),
        },
        {
          icon: Minus,
          label: "Divider",
          active: false,
          action: () => editor.chain().focus().setHorizontalRule().run(),
        },
      ],
    },
  ];

  return (
    <div className="flex items-center gap-1 px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex-wrap">
      {tools.map((section, si) => (
        <div key={si} className="flex items-center gap-0.5">
          {si > 0 && (
            <Separator
              orientation="vertical"
              className="h-5 mx-1 bg-zinc-200 dark:bg-zinc-700"
            />
          )}
          {section.group.map((tool) => {
            const Icon = tool.icon;
            return (
              <Toggle
                key={tool.label}
                size="sm"
                pressed={tool.active}
                onPressedChange={tool.action}
                aria-label={tool.label}
                className={`
                  h-7 w-7 p-0 rounded-lg
                  data-[state=on]:bg-purple-100 data-[state=on]:text-purple-700
                  dark:data-[state=on]:bg-purple-950 dark:data-[state=on]:text-purple-300
                  hover:bg-zinc-100 dark:hover:bg-zinc-800
                  text-zinc-500 dark:text-zinc-400
                  transition-colors
                `}
              >
                <Icon className="w-3.5 h-3.5" />
              </Toggle>
            );
          })}
        </div>
      ))}

      {/* Spacer + undo/redo */}
      <div className="ml-auto flex items-center gap-0.5">
        <Separator
          orientation="vertical"
          className="h-5 mx-1 bg-zinc-200 dark:bg-zinc-700"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="h-7 w-7 p-0 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-30"
          aria-label="Undo"
        >
          <Undo className="w-3.5 h-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="h-7 w-7 p-0 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-30"
          aria-label="Redo"
        >
          <Redo className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
