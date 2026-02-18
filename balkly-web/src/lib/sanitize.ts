import DOMPurify from 'dompurify';

const ALLOWED_TAGS = [
  'strong', 'em', 'code', 'a', 'img', 'br', 'p', 'div', 'span',
  'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'blockquote', 'pre', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'hr', 'sub', 'sup', 'del', 'ins',
];

const ALLOWED_ATTR = [
  'href', 'src', 'alt', 'class', 'target', 'rel', 'width', 'height',
  'style', 'title',
];

export function sanitizeHtml(dirty: string): string {
  if (typeof window === 'undefined') return dirty;
  
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });
}

export function markdownToSafeHtml(content: string): string {
  if (!content) return '';
  
  const html = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">$1</code>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-lg my-2" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\n/g, '<br/>');
  
  return sanitizeHtml(html);
}
