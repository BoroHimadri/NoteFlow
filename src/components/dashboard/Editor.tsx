"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

export default function Editor({
  content,
  onChange,
}: {
  content: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing your masterpiece...",
      }),
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },

    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert focus:outline-none max-w-full min-h-[200px] p-4",
      },
    },
  });

  return (
    <div className="border rounded-md bg-zinc-50/50 dark:bg-zinc-900/50">
      <EditorContent editor={editor} />
    </div>
  );
}
