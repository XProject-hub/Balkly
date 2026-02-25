"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  maxLength?: number;
}

const EMOJIS = ["😊","😂","❤️","👍","🎉","🔥","💯","✅","⭐","🏆","📦","🚗","🏠","📱","👔","🛋️","💪","💼","🔧","📸","💰","🎯","✨","🙌","👀","💎","🌟","📞","📧","🤝"];

const COLORS = ["#000000","#ffffff","#ef4444","#f97316","#eab308","#22c55e","#3b82f6","#8b5cf6","#ec4899","#6b7280","#1d4ed8","#15803d"];

export default function RichTextEditor({ value, onChange, placeholder = "Describe your ad...", maxLength = 5000 }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("https://");
  const [linkText, setLinkText] = useState("");
  const [charCount, setCharCount] = useState(0);
  const isInitialized = useRef(false);
  const savedSelection = useRef<Range | null>(null);

  useEffect(() => {
    if (editorRef.current && !isInitialized.current) {
      isInitialized.current = true;
      editorRef.current.innerHTML = value || "";
      setCharCount((value || "").replace(/<[^>]*>/g, "").length);
    }
  }, []);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelection.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (savedSelection.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelection.current);
      }
    }
  };

  const exec = useCallback((cmd: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
    handleChange();
  }, []);

  const handleChange = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      const text = editorRef.current.innerText || "";
      setCharCount(text.length);
      onChange(html === "<br>" ? "" : html);
    }
  };

  const insertLink = () => {
    restoreSelection();
    if (linkUrl && linkUrl !== "https://") {
      const display = linkText || linkUrl;
      document.execCommand("insertHTML", false, `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" style="color:#3b82f6;text-decoration:underline">${display}</a>&nbsp;`);
      handleChange();
    }
    setShowLinkModal(false);
    setLinkUrl("https://");
    setLinkText("");
  };

  const insertEmoji = (emoji: string) => {
    restoreSelection();
    document.execCommand("insertText", false, emoji);
    handleChange();
    setShowEmojiPicker(false);
  };

  const applyColor = (color: string) => {
    restoreSelection();
    document.execCommand("foreColor", false, color);
    handleChange();
    setShowColorPicker(false);
  };

  const tools = [
    { icon: "B", title: "Bold", action: () => exec("bold"), style: "font-bold" },
    { icon: "I", title: "Italic", action: () => exec("italic"), style: "italic" },
    { icon: "U", title: "Underline", action: () => exec("underline"), style: "underline" },
    { icon: "S", title: "Strikethrough", action: () => exec("strikeThrough"), style: "line-through" },
    { type: "sep" },
    { icon: "H2", title: "Heading 2", action: () => exec("formatBlock", "h2") },
    { icon: "H3", title: "Heading 3", action: () => exec("formatBlock", "h3") },
    { icon: "¶", title: "Paragraph", action: () => exec("formatBlock", "p") },
    { type: "sep" },
    { icon: "≡", title: "Bullet list", action: () => exec("insertUnorderedList") },
    { icon: "1.", title: "Numbered list", action: () => exec("insertOrderedList") },
    { type: "sep" },
    { icon: "«»", title: "Align left", action: () => exec("justifyLeft") },
    { icon: "≡≡", title: "Align center", action: () => exec("justifyCenter") },
    { icon: "»«", title: "Align right", action: () => exec("justifyRight") },
  ];

  return (
    <div className="border rounded-lg overflow-hidden dark:border-gray-700">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b bg-muted/50 dark:border-gray-700">
        {tools.map((tool, i) =>
          tool.type === "sep" ? (
            <div key={i} className="w-px h-5 bg-border mx-1" />
          ) : (
            <button
              key={i}
              type="button"
              title={tool.title}
              onMouseDown={(e) => { e.preventDefault(); tool.action!(); }}
              className={`px-2 py-1 rounded text-xs hover:bg-background transition-colors ${tool.style || ""}`}
            >
              {tool.icon}
            </button>
          )
        )}

        {/* Link button */}
        <button
          type="button"
          title="Insert link"
          onMouseDown={(e) => { e.preventDefault(); saveSelection(); setShowLinkModal(true); }}
          className="px-2 py-1 rounded text-xs hover:bg-background transition-colors text-blue-500"
        >
          🔗
        </button>

        {/* Color picker */}
        <div className="relative">
          <button
            type="button"
            title="Text color"
            onMouseDown={(e) => { e.preventDefault(); saveSelection(); setShowColorPicker(!showColorPicker); }}
            className="px-2 py-1 rounded text-xs hover:bg-background transition-colors"
          >
            🎨
          </button>
          {showColorPicker && (
            <div className="absolute top-8 left-0 z-20 bg-background border rounded-lg shadow-xl p-2 grid grid-cols-6 gap-1 w-40">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); applyColor(c); }}
                  className="w-5 h-5 rounded border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          )}
        </div>

        {/* Emoji picker */}
        <div className="relative">
          <button
            type="button"
            title="Insert emoji"
            onMouseDown={(e) => { e.preventDefault(); saveSelection(); setShowEmojiPicker(!showEmojiPicker); }}
            className="px-2 py-1 rounded text-xs hover:bg-background transition-colors"
          >
            😊
          </button>
          {showEmojiPicker && (
            <div className="absolute top-8 left-0 z-20 bg-background border rounded-lg shadow-xl p-2 grid grid-cols-6 gap-1 w-48">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); insertEmoji(emoji); }}
                  className="text-lg hover:bg-muted rounded p-0.5 transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Clear formatting */}
        <button
          type="button"
          title="Clear formatting"
          onMouseDown={(e) => { e.preventDefault(); exec("removeFormat"); }}
          className="px-2 py-1 rounded text-xs hover:bg-background transition-colors text-muted-foreground ml-auto"
        >
          ✕
        </button>
      </div>

      {/* Editor area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleChange}
        onBlur={handleChange}
        className="min-h-[140px] p-4 text-sm focus:outline-none prose prose-sm max-w-none dark:prose-invert"
        style={{ wordBreak: "break-word" }}
        data-placeholder={placeholder}
      />

      {/* Character count */}
      <div className="flex justify-between items-center px-3 py-1.5 border-t bg-muted/30 dark:border-gray-700">
        <span className="text-xs text-muted-foreground">
          HTML formatting supported · links open in new tab
        </span>
        <span className={`text-xs ${charCount > maxLength * 0.9 ? "text-orange-500" : "text-muted-foreground"}`}>
          {charCount}/{maxLength}
        </span>
      </div>

      {/* Link modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl shadow-xl p-5 w-full max-w-sm border">
            <h3 className="font-bold mb-3">Insert Link</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium block mb-1">URL</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700"
                  placeholder="https://example.com"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Display text (optional)</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-700"
                  placeholder="Click here"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={insertLink} className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium">
                  Insert
                </button>
                <button onClick={() => setShowLinkModal(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-muted">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        [contenteditable] h2 { font-size: 1.25rem; font-weight: 700; margin: 0.5rem 0; }
        [contenteditable] h3 { font-size: 1.1rem; font-weight: 600; margin: 0.4rem 0; }
        [contenteditable] ul { list-style: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
        [contenteditable] ol { list-style: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
        [contenteditable] a { color: #3b82f6; text-decoration: underline; }
        [contenteditable] b, [contenteditable] strong { font-weight: bold; }
        [contenteditable] i, [contenteditable] em { font-style: italic; }
      `}</style>
    </div>
  );
}
