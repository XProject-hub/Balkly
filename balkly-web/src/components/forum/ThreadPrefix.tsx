"use client";

interface ThreadPrefixProps {
  prefix: string;
}

const prefixStyles: Record<string, { bg: string; text: string; border: string }> = {
  'question': { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-300' },
  'discussion': { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-700 dark:text-green-300', border: 'border-green-300' },
  'sale': { bg: 'bg-orange-100 dark:bg-orange-900', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-300' },
  'help': { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-300' },
  'announcement': { bg: 'bg-red-100 dark:bg-red-900', text: 'text-red-700 dark:text-red-300', border: 'border-red-300' },
};

export default function ThreadPrefix({ prefix }: ThreadPrefixProps) {
  if (!prefix) return null;

  const style = prefixStyles[prefix.toLowerCase()] || prefixStyles['discussion'];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${style.bg} ${style.text} ${style.border}`}>
      {prefix.toUpperCase()}
    </span>
  );
}

