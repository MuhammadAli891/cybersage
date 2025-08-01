'use client';

import { useEditor, EditorContent, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import CodeBlock from '@tiptap/extension-code-block';
import Blockquote from '@tiptap/extension-blockquote';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { useState, forwardRef, useImperativeHandle } from 'react';
import React from 'react'; // Added missing import

// Custom Font Size Extension
const FontSize = Extension.create({
  name: 'fontSize',
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize,
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {}
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ commands }) => {
        return commands.setMark('textStyle', { fontSize })
      },
      unsetFontSize: () => ({ commands }) => {
        return commands.unsetMark('textStyle')
      },
    }
  },
})

interface TiptapEditorProps {
  content: string;
  onChange?: (content: string) => void;
  placeholder?: string;
}

const TiptapEditor = forwardRef<{ getCurrentContent: () => string }, TiptapEditorProps>(
  ({ content, onChange, placeholder = "Start writing your post here..." }, ref) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      CodeBlock,
      Blockquote,
      TextStyle,
      Color,
      FontSize,
    ],
    content,
    immediatelyRender: false, // Fix for SSR hydration issues
    // REMOVED: onUpdate callback to prevent auto-save
  });

  // Expose the getCurrentContent function to parent component
  useImperativeHandle(ref, () => ({
    getCurrentContent: () => editor?.getHTML() || ''
  }), [editor]);

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const setFontSize = (size: string) => {
    editor.chain().focus().setFontSize(size).run();
  };

  const setTextColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px'];
  const colors = [
    '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
    '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
    '#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc',
    '#dd7e6b', '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#a4c2f4', '#b4a7d6', '#d5a6bd',
    '#cc4125', '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6d9eeb', '#8e7cc3', '#c27ba0'
  ];

  return (
    <div className="border border-gray-300 rounded-lg">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-1">
          {/* Font Size */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFontSize(!showFontSize)}
              className="p-2 rounded hover:bg-gray-200 flex items-center space-x-1"
              title="Font Size"
            >
              <i className="fas fa-text-height"></i>
              <span className="text-xs">Size</span>
            </button>
            {showFontSize && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-2 min-w-32">
                <div className="text-xs font-semibold mb-2 text-gray-700">Font Size</div>
                {fontSizes.map((size, index) => (
                  <button
                    key={`${size}-${index}`}
                    type="button"
                    onClick={() => {
                      setFontSize(size);
                      setShowFontSize(false);
                    }}
                    className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                    style={{ fontSize: size }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Text Color */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-2 rounded hover:bg-gray-200 flex items-center space-x-1"
              title="Text Color"
            >
              <i className="fas fa-palette"></i>
              <span className="text-xs">Color</span>
            </button>
            {showColorPicker && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-3 min-w-80">
                <div className="text-xs font-semibold mb-2 text-gray-700">Text Color</div>
                <div className="grid grid-cols-10 gap-1">
                  {colors.map((color, index) => (
                    <button
                      key={`${color}-${index}`}
                      type="button"
                      onClick={() => {
                        setTextColor(color);
                        setShowColorPicker(false);
                      }}
                      className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          {/* Text Formatting */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-300' : ''}`}
            title="Bold"
          >
            <i className="fas fa-bold"></i>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-300' : ''}`}
            title="Italic"
          >
            <i className="fas fa-italic"></i>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-gray-300' : ''}`}
            title="Underline"
          >
            <i className="fas fa-underline"></i>
          </button>
          
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          
          {/* Headings */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''}`}
            title="Heading 1"
          >
            <i className="fas fa-heading"></i>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''}`}
            title="Heading 2"
          >
            <i className="fas fa-heading text-sm"></i>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''}`}
            title="Heading 3"
          >
            <i className="fas fa-heading text-xs"></i>
          </button>
          
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          
          {/* Lists */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-300' : ''}`}
            title="Bullet List"
          >
            <i className="fas fa-list-ul"></i>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-300' : ''}`}
            title="Numbered List"
          >
            <i className="fas fa-list-ol"></i>
          </button>
          
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          
          {/* Text Alignment */}
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''}`}
            title="Align Left"
          >
            <i className="fas fa-align-left"></i>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''}`}
            title="Align Center"
          >
            <i className="fas fa-align-center"></i>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''}`}
            title="Align Right"
          >
            <i className="fas fa-align-right"></i>
          </button>
          
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          
          {/* Media & Advanced */}
          <button
            type="button"
            onClick={addImage}
            className="p-2 rounded hover:bg-gray-200"
            title="Insert Image"
          >
            <i className="fas fa-image"></i>
          </button>
          <button
            type="button"
            onClick={addTable}
            className="p-2 rounded hover:bg-gray-200"
            title="Insert Table"
          >
            <i className="fas fa-table"></i>
          </button>
          <button
            type="button"
            onClick={addLink}
            className="p-2 rounded hover:bg-gray-200"
            title="Insert Link"
          >
            <i className="fas fa-link"></i>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('codeBlock') ? 'bg-gray-300' : ''}`}
            title="Code Block"
          >
            <i className="fas fa-code"></i>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-300' : ''}`}
            title="Quote"
          >
            <i className="fas fa-quote-right"></i>
          </button>
        </div>
        
        {/* Undo/Redo */}
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo"
          >
            <i className="fas fa-undo"></i>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo"
          >
            <i className="fas fa-redo"></i>
          </button>
        </div>
      </div>
      
      {/* Editor Content */}
      <div className="p-4 min-h-80">
        <EditorContent 
          editor={editor} 
          className="prose prose-lg max-w-none focus:outline-none [&_.ProseMirror]:min-h-[300px] [&_.ProseMirror]:p-4 [&_.ProseMirror]:outline-none [&_.ProseMirror_p]:mb-4 [&_.ProseMirror_p]:leading-relaxed [&_.ProseMirror_h1]:mb-6 [&_.ProseMirror_h1]:mt-8 [&_.ProseMirror_h2]:mb-4 [&_.ProseMirror_h2]:mt-6 [&_.ProseMirror_h3]:mb-3 [&_.ProseMirror_h3]:mt-4 [&_.ProseMirror_ul]:mb-4 [&_.ProseMirror_ol]:mb-4 [&_.ProseMirror_li]:mb-1 [&_.ProseMirror_blockquote]:mb-4 [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-gray-300 [&_.ProseMirror_table]:mb-4 [&_.ProseMirror_table]:w-full [&_.ProseMirror_table]:border-collapse [&_.ProseMirror_table]:border [&_.ProseMirror_table]:border-gray-300 [&_.ProseMirror_th]:border [&_.ProseMirror_th]:border-gray-300 [&_.ProseMirror_th]:p-2 [&_.ProseMirror_th]:bg-gray-50 [&_.ProseMirror_td]:border [&_.ProseMirror_td]:border-gray-300 [&_.ProseMirror_td]:p-2"
        />
      </div>
    </div>
  );
});

export default TiptapEditor; 