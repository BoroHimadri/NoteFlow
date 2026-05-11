import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

export const useDocumentEditor = (
  onUpdateAction: (html: string, text: string) => void
) => {
  return useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing… your ideas belong here.",
      }),
    ],
    content: "",
    immediatelyRender: false,
    onUpdate({ editor }) {
      onUpdateAction(editor.getHTML(), editor.getText());
    },
    editorProps: {
      attributes: {
        class:
          "focus:outline-none min-h-[60vh] text-zinc-800 dark:text-zinc-200",
      },
    },
  });
};
