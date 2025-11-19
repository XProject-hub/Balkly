"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Link as LinkIcon, List, Code, Eye, Smile, Image } from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const emojis = ['😀', '😂', '❤️', '👍', '👏', '🎉', '🔥', '💯', '✅', '❌', '⚠️', '💪', '🙏', '🤝', '👀', '💡', '🚀', '⭐'];

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || 'text';
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    // Focus back
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b p-2 flex items-center gap-1">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => insertMarkdown('**', '**')}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => insertMarkdown('*', '*')}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => insertMarkdown('[', '](url)')}
          title="Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => insertMarkdown('- ', '\n')}
          title="List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => insertMarkdown('`', '`')}
          title="Code"
        >
          <Code className="h-4 w-4" />
        </Button>
        
        <div className="border-l mx-2" />
        
        {/* Emoji Picker */}
        <div className="relative">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            title="Emoji"
          >
            <Smile className="h-4 w-4" />
          </Button>
          {showEmojiPicker && (
            <div className="absolute top-10 left-0 bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-2 z-50 grid grid-cols-6 gap-1">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded text-xl"
                  onClick={() => {
                    onChange(value + emoji);
                    setShowEmojiPicker(false);
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="ml-auto">
          <Button
            type="button"
            size="sm"
            variant={showPreview ? "default" : "ghost"}
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? "Edit" : "Preview"}
          </Button>
        </div>
      </div>

      {/* Editor/Preview Area */}
      {showPreview ? (
        <div className="p-4 min-h-[200px] prose max-w-none">
          <div dangerouslySetInnerHTML={{ 
            __html: value
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
              .replace(/`(.*?)`/g, '<code>$1</code>')
              .replace(/\n/g, '<br/>')
          }} />
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Write your message... (Markdown supported)"}
          className="w-full p-4 min-h-[200px] resize-y focus:outline-none"
        />
      )}

      {/* Helper Text */}
      <div className="bg-gray-50 border-t px-4 py-2 text-xs text-gray-500">
        <span className="font-medium">Markdown:</span> **bold** *italic* [link](url) `code` - list
      </div>
    </div>
  );
}

