"use client";

import { useState } from "react";
import { Smile } from "lucide-react";

interface ReactionPickerProps {
  onReact: (type: string) => void;
  currentReaction?: string;
}

const reactions = [
  { type: 'like', emoji: '👍', label: 'Like' },
  { type: 'love', emoji: '❤️', label: 'Love' },
  { type: 'haha', emoji: '😂', label: 'Haha' },
  { type: 'wow', emoji: '😮', label: 'Wow' },
  { type: 'sad', emoji: '😢', label: 'Sad' },
  { type: 'angry', emoji: '😡', label: 'Angry' },
];

export default function ReactionPicker({ onReact, currentReaction }: ReactionPickerProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShow(!show)}
        className="text-gray-500 hover:text-primary transition-colors"
        title="React"
      >
        {currentReaction ? (
          <span className="text-xl">
            {reactions.find(r => r.type === currentReaction)?.emoji || '👍'}
          </span>
        ) : (
          <Smile className="h-5 w-5" />
        )}
      </button>

      {show && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShow(false)} />
          <div className="absolute bottom-full mb-2 left-0 bg-white dark:bg-gray-800 border-2 rounded-lg shadow-xl p-2 z-50 flex gap-1">
            {reactions.map((reaction) => (
              <button
                key={reaction.type}
                onClick={() => {
                  onReact(reaction.type);
                  setShow(false);
                }}
                className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hover:scale-125 ${
                  currentReaction === reaction.type ? 'bg-blue-50 dark:bg-blue-900' : ''
                }`}
                title={reaction.label}
              >
                <span className="text-2xl">{reaction.emoji}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

