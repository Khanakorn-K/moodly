"use client";

import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Highlight } from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { Selection } from "@tiptap/extensions/selection";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Heading2,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  ListTodo,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Underline,
  Undo2,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/cores/lib/utils";

type TiptapProps = {
  setText: (text: string) => void;
  oldValue?: string;
};

type TiptapEditor = ReturnType<typeof useEditor> | null;

type ToolbarButtonProps = {
  children: ReactNode;
  editor: TiptapEditor;
  isActive?: boolean;
  label: string;
  onClick: () => void;
};

const ToolbarButton = ({
  children,
  editor,
  isActive = false,
  label,
  onClick,
}: ToolbarButtonProps) => (
  <button
    type="button"
    aria-label={label}
    aria-pressed={isActive}
    disabled={!editor}
    title={label}
    onClick={onClick}
    className={cn(
      "flex size-8 shrink-0 items-center justify-center rounded-lg text-white/55 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30",
      isActive && "bg-white text-black hover:bg-white/90 hover:text-black",
    )}
  >
    {children}
  </button>
);

const ToolbarSeparator = () => (
  <span className="mx-1 h-5 w-px shrink-0 bg-white/10" />
);

const TiptapToolbar = ({ editor }: { editor: TiptapEditor }) => {
  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => ({
      alignCenter: editor?.isActive({ textAlign: "center" }) ?? false,
      alignLeft: editor?.isActive({ textAlign: "left" }) ?? false,
      alignRight: editor?.isActive({ textAlign: "right" }) ?? false,
      blockquote: editor?.isActive("blockquote") ?? false,
      bold: editor?.isActive("bold") ?? false,
      bulletList: editor?.isActive("bulletList") ?? false,
      code: editor?.isActive("code") ?? false,
      heading2: editor?.isActive("heading", { level: 2 }) ?? false,
      highlight: editor?.isActive("highlight") ?? false,
      italic: editor?.isActive("italic") ?? false,
      orderedList: editor?.isActive("orderedList") ?? false,
      strike: editor?.isActive("strike") ?? false,
      subscript: editor?.isActive("subscript") ?? false,
      superscript: editor?.isActive("superscript") ?? false,
      taskList: editor?.isActive("taskList") ?? false,
      underline: editor?.isActive("underline") ?? false,
    }),
  });

  return (
    <div className="flex gap-1 overflow-x-auto border-b border-white/10 bg-black/10 p-2">
      <ToolbarButton
        editor={editor}
        label="หัวข้อ"
        isActive={editorState?.heading2}
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        <Heading2 size={16} />
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton
        editor={editor}
        label="ตัวหนา"
        isActive={editorState?.bold}
        onClick={() => editor?.chain().focus().toggleBold().run()}
      >
        <Bold size={16} />
      </ToolbarButton>
      <ToolbarButton
        editor={editor}
        label="ตัวเอียง"
        isActive={editorState?.italic}
        onClick={() => editor?.chain().focus().toggleItalic().run()}
      >
        <Italic size={16} />
      </ToolbarButton>
      <ToolbarButton
        editor={editor}
        label="ขีดเส้นใต้"
        isActive={editorState?.underline}
        onClick={() => editor?.chain().focus().toggleUnderline().run()}
      >
        <Underline size={16} />
      </ToolbarButton>
      <ToolbarButton
        editor={editor}
        label="ขีดฆ่า"
        isActive={editorState?.strike}
        onClick={() => editor?.chain().focus().toggleStrike().run()}
      >
        <Strikethrough size={16} />
      </ToolbarButton>
      <ToolbarButton
        editor={editor}
        label="ไฮไลต์"
        isActive={editorState?.highlight}
        onClick={() => editor?.chain().focus().toggleHighlight().run()}
      >
        <Highlighter size={16} />
      </ToolbarButton>
      <ToolbarButton
        editor={editor}
        label="ตัวยก"
        isActive={editorState?.superscript}
        onClick={() => editor?.chain().focus().toggleSuperscript().run()}
      >
        <SuperscriptIcon size={16} />
      </ToolbarButton>
      <ToolbarButton
        editor={editor}
        label="ตัวห้อย"
        isActive={editorState?.subscript}
        onClick={() => editor?.chain().focus().toggleSubscript().run()}
      >
        <SubscriptIcon size={16} />
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton
        editor={editor}
        label="รายการหัวข้อ"
        isActive={editorState?.bulletList}
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
      >
        <List size={16} />
      </ToolbarButton>
      <ToolbarButton
        editor={editor}
        label="รายการตัวเลข"
        isActive={editorState?.orderedList}
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={16} />
      </ToolbarButton>
      <ToolbarButton
        editor={editor}
        label="รายการงาน"
        isActive={editorState?.taskList}
        onClick={() => editor?.chain().focus().toggleTaskList().run()}
      >
        <ListTodo size={16} />
      </ToolbarButton>
      <ToolbarButton
        editor={editor}
        label="คำพูดอ้างอิง"
        isActive={editorState?.blockquote}
        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
      >
        <Quote size={16} />
      </ToolbarButton>
      <ToolbarButton
        editor={editor}
        label="โค้ด"
        isActive={editorState?.code}
        onClick={() => editor?.chain().focus().toggleCode().run()}
      >
        <Code2 size={16} />
      </ToolbarButton>
      <ToolbarButton
        editor={editor}
        label="เส้นคั่น"
        onClick={() => editor?.chain().focus().setHorizontalRule().run()}
      >
        <Minus size={16} />
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton
        editor={editor}
        label="จัดชิดซ้าย"
        isActive={editorState?.alignLeft}
        onClick={() => editor?.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft size={16} />
      </ToolbarButton>
      <ToolbarButton
        editor={editor}
        label="จัดกึ่งกลาง"
        isActive={editorState?.alignCenter}
        onClick={() => editor?.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter size={16} />
      </ToolbarButton>
      <ToolbarButton
        editor={editor}
        label="จัดชิดขวา"
        isActive={editorState?.alignRight}
        onClick={() => editor?.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight size={16} />
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton
        editor={editor}
        label="ย้อนกลับ"
        onClick={() => editor?.chain().focus().undo().run()}
      >
        <Undo2 size={16} />
      </ToolbarButton>
      <ToolbarButton
        editor={editor}
        label="ทำซ้ำ"
        onClick={() => editor?.chain().focus().redo().run()}
      >
        <Redo2 size={16} />
      </ToolbarButton>
    </div>
  );
};

const Tiptap = ({ setText, oldValue }: TiptapProps) => {
  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        autocomplete: "on",
        autocorrect: "on",
        autocapitalize: "on",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      //   Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      //   ImageUploadNode.configure({
      //     accept: "image/*",
      //     maxSize: MAX_FILE_SIZE,
      //     limit: 3,
      //     upload: handleImageUpload,
      //     onError: (error) => console.error("Upload failed:", error),
      //   }),
    ],
    content: oldValue,
    onUpdate: ({ editor }) => {
      setText(editor.getHTML());
    },
  });

  return (
    <div
      className="
      overflow-hidden rounded-2xl
      border border-white/10
      bg-white/[0.03]
      text-white shadow-inner
      transition-colors
      focus-within:border-white/25
      focus-within:bg-white/[0.05]
    "
    >
      <TiptapToolbar editor={editor} />

      <EditorContent
        editor={editor}
        className="
        [&_.ProseMirror]:min-h-[220px]
        [&_.ProseMirror]:px-5
        [&_.ProseMirror]:py-4
        [&_.ProseMirror]:text-base
        [&_.ProseMirror]:leading-7
        [&_.ProseMirror]:outline-none

        [&_.ProseMirror_p]:mb-2
        [&_.ProseMirror_ul]:list-disc
        [&_.ProseMirror_ul]:pl-6
        [&_.ProseMirror_ol]:list-decimal
        [&_.ProseMirror_ol]:pl-6
        [&_.ProseMirror_blockquote]:border-l-2
        [&_.ProseMirror_blockquote]:border-white/30
        [&_.ProseMirror_blockquote]:pl-4
        [&_.ProseMirror_blockquote]:text-white/60
        [&_.ProseMirror_ul[data-type='taskList']]:list-none
        [&_.ProseMirror_ul[data-type='taskList']]:pl-0
        [&_.ProseMirror_li[data-type='taskItem']]:flex
        [&_.ProseMirror_li[data-type='taskItem']]:gap-2
      "
      />
    </div>
  );
};

export default Tiptap;
