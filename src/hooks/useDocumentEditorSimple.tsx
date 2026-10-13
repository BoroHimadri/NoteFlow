import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef } from "react";

export const useDocumentEditorSimple = (
  documentId: string,
  onUpdateAction: (html: string, text: string) => void,
  editable = true
) => {
  const lastRemoteUpdate = useRef("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing… your ideas belong here.",
      }),
    ],
    editable,
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

  const applyRemoteUpdate = (html: string) => {
    if (!editor || editor.isDestroyed) return;
    if (lastRemoteUpdate.current === html) return;
    lastRemoteUpdate.current = html;
    const currentPos = editor.state.selection.to;
    editor.commands.setContent(html, { emitUpdate: false });
    try {
      editor.commands.setTextSelection(currentPos);
    } catch (e) {
      editor.commands.focus("end");
    }
  };

  return { editor, applyRemoteUpdate };
};
