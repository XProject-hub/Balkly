"use client";

interface QuoteReplyProps {
  authorName: string;
  content: string;
  onQuote: (quotedText: string) => void;
}

export default function QuoteReply({ authorName, content, onQuote }: QuoteReplyProps) {
  const handleQuote = () => {
    const quotedText = `> **${authorName} wrote:**\n> ${content.split('\n').join('\n> ')}\n\n`;
    onQuote(quotedText);
  };

  return (
    <button
      onClick={handleQuote}
      className="text-sm text-gray-500 hover:text-primary transition-colors"
      title="Quote"
    >
      Quote
    </button>
  );
}

