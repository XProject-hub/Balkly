"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Link as LinkIcon, List, Code, Eye, Smile, Image, Film } from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Popular GIFs for quick access
const quickGifs = [
  'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif', // thumbs up
  'https://media.giphy.com/media/g9582DNuQppxC/giphy.gif', // clapping
  'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif', // laughing
  'https://media.giphy.com/media/XreQmk7ETCak0/giphy.gif', // shocked
  'https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif', // thinking
  'https://media.giphy.com/media/3ohzdIuqJoo8QdKlnW/giphy.gif', // party
  'https://media.giphy.com/media/111ebonMs90YLu/giphy.gif', // love
  'https://media.giphy.com/media/ZfK4cXKJTTay1Ava29/giphy.gif', // celebrate
];

export default function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [gifSearch, setGifSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const emojis = [
    // Smileys & Emotion
    '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
    '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐',
    '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒',
    '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐', '😕',
    '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱',
    '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩',
    // Hearts & Love
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖',
    '💘', '💝', '💟', '♥️', '💌', '💋',
    // Hands & Body
    '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆',
    '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '💪',
    '🦾', '🦿', '🦵', '🦶',
    // Symbols & Objects
    '❤️', '🔥', '⭐', '🌟', '✨', '💫', '💥', '💢', '💯', '✅', '❌', '❗', '❓', '⚠️', '🚫', '💬',
    '💭', '🗨️', '🗯️', '💤', '💡', '🔔', '🔕', '📢', '📣', '📌', '📍', '🚀', '🎯', '🎁', '🎉', '🎊',
    '🎈', '🎀', '🏆', '🥇', '🥈', '🥉', '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱',
    '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳', '🏹', '🎣', '🤿', '🥊', '🥋', '⛸️', '🛹', '🛼',
    // Food & Drink
    '🍕', '🍔', '🍟', '🌭', '🍿', '🧈', '🍖', '🍗', '🥩', '🥓', '🍞', '🥐', '🥨', '🧀', '🥚', '🍳',
    '🧇', '🥞', '🧈', '🍤', '🍱', '🍣', '🍛', '🍝', '🍜', '🍲', '🍥', '🥮', '🍡', '🥟', '🥠', '🥡',
    '🦀', '🦞', '🦐', '🦑', '🦪', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬',
    '🍭', '🍮', '☕', '🍵', '🧃', '🥤', '🧋', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧉',
    // Nature & Animals
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈',
    '🙉', '🙊', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🪱',
    '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🪰', '🪲', '🦗', '🕷️', '🦂', '🐢', '🐍', '🦎', '🐙', '🦑'
  ];

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    
    console.log('insertMarkdown called', { before, after, textarea });
    
    if (!textarea) {
      console.error('Textarea ref is null!');
      alert('Editor error - please refresh page');
      return;
    }

    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const selectedText = value.substring(start, end) || 'text';
    const beforeText = value.substring(0, start);
    const afterText = value.substring(end);
    
    const newText = beforeText + before + selectedText + after + afterText;
    
    console.log('Inserting markdown', { 
      start, 
      end, 
      selectedText, 
      newText: newText.substring(0, 50) + '...' 
    });
    
    onChange(newText);
    
    // Focus back and set cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    
    try {
      // Use simple public storage upload
      const formData = new FormData();
      Array.from(files).forEach((file, index) => {
        formData.append('images[]', file, file.name);
      });
      
      console.log('Uploading files:', files.length);

      const response = await fetch('/api/v1/forum/upload-images', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          // Don't set Content-Type - let browser set it with boundary for multipart/form-data
        },
        body: formData,
      });

      console.log('Upload response:', response.status);
      console.log('Content-Type:', response.headers.get('content-type'));
      
      const responseText = await response.text();
      console.log('Response text (first 500 chars):', responseText.substring(0, 500));
      
      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          console.log('Upload data:', data);
          // Insert markdown image tags
          const imageMarkdown = data.images?.map((url: string) => `![Image](${url})`).join('\n') || '';
          onChange(value + '\n' + imageMarkdown);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          alert('Upload response is not valid JSON. Response: ' + responseText.substring(0, 200));
        }
      } else {
        console.error('Upload failed:', responseText.substring(0, 200));
        console.error('Upload error:', errorData);
        alert('Failed to upload: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Failed to upload images. Check console for details.');
    } finally {
      setUploading(false);
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
    }
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
        
        {/* Image Upload */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => imageInputRef.current?.click()}
          title="Upload Image"
          disabled={uploading}
        >
          {uploading ? '⏳' : <Image className="h-4 w-4" />}
        </Button>
        
        {/* Emoji Picker */}
        <div className="relative">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => {
              setShowEmojiPicker(!showEmojiPicker);
              setShowGifPicker(false);
            }}
            title="Emoji"
          >
            <Smile className="h-4 w-4" />
          </Button>
          {showEmojiPicker && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowEmojiPicker(false)} />
              <div className="absolute top-10 left-0 bg-white dark:bg-gray-800 border-2 rounded-lg shadow-2xl p-3 z-50 w-96 max-h-80 overflow-y-auto">
                <div className="mb-2 text-xs font-semibold text-gray-500">Click to insert</div>
                <div className="grid grid-cols-10 gap-1">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      className="hover:bg-primary/10 dark:hover:bg-primary/20 p-1 rounded text-xl transition-all hover:scale-125"
                      onClick={() => {
                        onChange(value + emoji);
                        setShowEmojiPicker(false);
                      }}
                      title={emoji}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* GIF Picker */}
        <div className="relative">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => {
              setShowGifPicker(!showGifPicker);
              setShowEmojiPicker(false);
            }}
            title="Insert GIF"
          >
            <Film className="h-4 w-4" />
          </Button>
          {showGifPicker && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowGifPicker(false)} />
              <div className="absolute top-10 left-0 bg-white dark:bg-gray-800 border-2 rounded-lg shadow-2xl p-3 z-50 w-96 max-h-96 overflow-y-auto">
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Search GIFs... (e.g., happy, party, laugh)"
                    value={gifSearch}
                    onChange={(e) => setGifSearch(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Or choose from popular GIFs below</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {quickGifs.map((gif, index) => (
                    <button
                      key={index}
                      type="button"
                      className="hover:opacity-80 transition-opacity border rounded overflow-hidden"
                      onClick={() => {
                        onChange(value + `\n![GIF](${gif})\n`);
                        setShowGifPicker(false);
                      }}
                    >
                      <img src={gif} alt="GIF" className="w-full h-24 object-cover" />
                    </button>
                  ))}
                </div>
                {gifSearch && (
                  <div className="mt-3 p-4 text-center text-sm text-gray-500">
                    <p>Enter Giphy URL or paste GIF link directly:</p>
                    <p className="text-xs mt-1">![GIF](your-gif-url)</p>
                  </div>
                )}
              </div>
            </>
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
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Write your message... (Markdown supported)"}
          className="w-full p-4 min-h-[200px] resize-y focus:outline-none dark:bg-gray-900 dark:text-gray-100"
        />
      )}

      {/* Helper Text */}
      <div className="bg-gray-50 border-t px-4 py-2 text-xs text-gray-500">
        <span className="font-medium">Markdown:</span> **bold** *italic* [link](url) `code` - list
      </div>
    </div>
  );
}

