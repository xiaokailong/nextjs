"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Youtube from '@tiptap/extension-youtube';
import { common, createLowlight } from 'lowlight';
import { Button } from '@heroui/react';
import { useEffect } from 'react';

const lowlight = createLowlight(common);

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-gray-900 text-white p-4 rounded-lg overflow-x-auto',
        },
      }),
      Youtube.configure({
        controls: true,
        nocookie: true,
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-lg',
        },
      }),
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addImage = () => {
    const url = window.prompt('请输入图片 URL:');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  // 当外部 content 变化时更新编辑器
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const addYoutubeVideo = () => {
    const url = window.prompt('请输入 YouTube 视频 URL:');
    if (url && editor) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* 工具栏 */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        <Button
          size="sm"
          variant={editor.isActive('bold') ? 'solid' : 'light'}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="min-w-unit-10"
        >
          <strong>B</strong>
        </Button>
        <Button
          size="sm"
          variant={editor.isActive('italic') ? 'solid' : 'light'}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="min-w-unit-10"
        >
          <em>I</em>
        </Button>
        <Button
          size="sm"
          variant={editor.isActive('code') ? 'solid' : 'light'}
          onClick={() => editor.chain().focus().toggleCode().run()}
          className="min-w-unit-10"
        >
          {'</>'}
        </Button>
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        <Button
          size="sm"
          variant={editor.isActive('heading', { level: 1 }) ? 'solid' : 'light'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          H1
        </Button>
        <Button
          size="sm"
          variant={editor.isActive('heading', { level: 2 }) ? 'solid' : 'light'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </Button>
        <Button
          size="sm"
          variant={editor.isActive('heading', { level: 3 }) ? 'solid' : 'light'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </Button>
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        <Button
          size="sm"
          variant={editor.isActive('bulletList') ? 'solid' : 'light'}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • 列表
        </Button>
        <Button
          size="sm"
          variant={editor.isActive('orderedList') ? 'solid' : 'light'}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. 列表
        </Button>
        <Button
          size="sm"
          variant={editor.isActive('blockquote') ? 'solid' : 'light'}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          &quot;引用&quot;
        </Button>
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        <Button
          size="sm"
          variant={editor.isActive('codeBlock') ? 'solid' : 'light'}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          代码块
        </Button>
        <Button
          size="sm"
          variant="light"
          onClick={addImage}
        >
          🖼️ 图片
        </Button>
        <Button
          size="sm"
          variant="light"
          onClick={addYoutubeVideo}
        >
          🎥 视频
        </Button>
        
        <div className="w-px h-6 bg-gray-300 mx-1" />
        
        <Button
          size="sm"
          variant="light"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          ─ 分隔线
        </Button>
        <Button
          size="sm"
          variant="light"
          onClick={() => editor.chain().focus().undo().run()}
          isDisabled={!editor.can().undo()}
        >
          ↶ 撤销
        </Button>
        <Button
          size="sm"
          variant="light"
          onClick={() => editor.chain().focus().redo().run()}
          isDisabled={!editor.can().redo()}
        >
          ↷ 重做
        </Button>
      </div>
      
      {/* 编辑器内容区 */}
      <EditorContent editor={editor} />
    </div>
  );
}
