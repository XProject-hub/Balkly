import DOMPurify from 'dompurify';

const ALLOWED_TAGS = [
  'strong', 'em', 'code', 'a', 'img', 'br', 'p', 'div', 'span',
  'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'blockquote', 'pre', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'hr', 'sub', 'sup', 'del', 'ins', 'article', 'section', 'style',
];

const ALLOWED_ATTR = [
  'href', 'src', 'alt', 'class', 'target', 'rel', 'width', 'height',
  'style', 'title', 'loading', 'id', 'name', 'type', 'value',
  'aria-label', 'viewBox', 'fill', 'd', 'xmlns',
];

export function sanitizeHtml(dirty: string): string {
  if (typeof window === 'undefined') return dirty;

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Scopes all CSS selectors inside <style> tags to a given wrapper class.
 * Prevents blog-post CSS from leaking into the global page styles.
 *
 * e.g. `body { color: red }` becomes `.blog-scope body, .blog-scope { color: red }`
 */
function scopeCss(css: string, scope: string): string {
  // Remove @charset / @import which shouldn't appear in embedded styles
  css = css.replace(/@charset\s+[^;]+;/gi, '');
  css = css.replace(/@import\s+[^;]+;/gi, '');

  // Process rule by rule using a simple state machine
  let out = '';
  let i = 0;

  while (i < css.length) {
    // Skip whitespace
    if (/\s/.test(css[i])) { out += css[i++]; continue; }

    // Skip comments
    if (css.slice(i, i + 2) === '/*') {
      const end = css.indexOf('*/', i + 2);
      if (end === -1) break;
      out += css.slice(i, end + 2);
      i = end + 2;
      continue;
    }

    // @-rules (e.g. @media, @keyframes) – copy entire block as-is
    if (css[i] === '@') {
      const semiColon = css.indexOf(';', i);
      const openBrace  = css.indexOf('{', i);

      if (semiColon !== -1 && (openBrace === -1 || semiColon < openBrace)) {
        // Simple @-rule like @charset (already removed) or @namespace
        out += css.slice(i, semiColon + 1);
        i = semiColon + 1;
      } else if (openBrace !== -1) {
        // Block @-rule: find matching closing }
        let depth = 0;
        let j = openBrace;
        while (j < css.length) {
          if (css[j] === '{') depth++;
          else if (css[j] === '}') { depth--; if (depth === 0) { j++; break; } }
          j++;
        }
        out += css.slice(i, j);
        i = j;
      } else break;
      continue;
    }

    // Regular rule: collect selector up to {
    const braceStart = css.indexOf('{', i);
    if (braceStart === -1) break;

    const selector = css.slice(i, braceStart).trim();

    // Find matching closing }
    let depth = 0;
    let j = braceStart;
    while (j < css.length) {
      if (css[j] === '{') depth++;
      else if (css[j] === '}') { depth--; if (depth === 0) { j++; break; } }
      j++;
    }
    const body = css.slice(braceStart, j);

    // Scope each selector part
    const scopedSelector = selector
      .split(',')
      .map(s => {
        s = s.trim();
        if (!s) return '';
        // body / html → replace with scope class itself
        if (/^(html|body)\s*$/.test(s)) return scope;
        // already scoped
        if (s.startsWith(scope)) return s;
        return `${scope} ${s}`;
      })
      .filter(Boolean)
      .join(',\n');

    out += `${scopedSelector} ${body}\n`;
    i = j;
  }

  return out;
}

/**
 * Sanitizes HTML and scopes any embedded <style> blocks so they don't
 * affect the rest of the page. Use this for blog post content.
 */
export function sanitizeBlogHtml(dirty: string): string {
  if (typeof window === 'undefined') return dirty;

  const scope = '.blog-post-scope';

  // 1. Scope style tags before sanitization (DOMPurify keeps <style> content)
  const withScopedStyles = dirty.replace(
    /<style[^>]*>([\s\S]*?)<\/style>/gi,
    (_, css) => `<style>${scopeCss(css, scope)}</style>`
  );

  return DOMPurify.sanitize(withScopedStyles, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    FORCE_BODY: true,
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
