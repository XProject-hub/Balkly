/**
 * Parse @mentions in text
 */
export function parseMentions(text: string): { text: string; mentions: string[] } {
  const mentionRegex = /@([a-zA-Z0-9_-]+)/g;
  const mentions: string[] = [];
  
  const parsedText = text.replace(mentionRegex, (match, username) => {
    mentions.push(username);
    return `<span class="mention" data-username="${username}">@${username}</span>`;
  });
  
  return { text: parsedText, mentions: Array.from(new Set(mentions)) };
}

/**
 * Convert markdown-style mentions to HTML
 */
export function renderMentions(text: string): string {
  return text.replace(/@([a-zA-Z0-9_-]+)/g, 
    '<a href="/profile/$1" class="text-primary hover:underline font-medium">@$1</a>'
  );
}

/**
 * Add mention autocomplete suggestions
 */
export function getMentionSuggestions(text: string, cursorPos: number, users: any[]): any[] {
  // Find @mention being typed
  const beforeCursor = text.substring(0, cursorPos);
  const match = beforeCursor.match(/@([a-zA-Z0-9_-]*)$/);
  
  if (!match) return [];
  
  const search = match[1].toLowerCase();
  
  return users
    .filter(u => u.name.toLowerCase().includes(search))
    .slice(0, 5);
}

