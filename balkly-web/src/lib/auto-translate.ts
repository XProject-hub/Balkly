/**
 * Auto-translate page content using Google Translate API
 */

const TRANSLATION_CACHE: Record<string, string> = {};

export async function translateElement(element: HTMLElement, targetLang: string) {
  const originalText = element.getAttribute('data-original-text') || element.textContent;
  
  if (!originalText || originalText.trim() === '') return;
  
  // Store original if not stored
  if (!element.getAttribute('data-original-text')) {
    element.setAttribute('data-original-text', originalText);
  }
  
  // If target is English, restore original
  if (targetLang === 'en') {
    element.textContent = originalText;
    return;
  }
  
  // Check cache
  const cacheKey = `${originalText}_${targetLang}`;
  if (TRANSLATION_CACHE[cacheKey]) {
    element.textContent = TRANSLATION_CACHE[cacheKey];
    return;
  }
  
  // Call translation API
  try {
    const response = await fetch('/api/v1/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: originalText,
        target: targetLang,
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      const translated = data.translated;
      
      // Cache and apply
      TRANSLATION_CACHE[cacheKey] = translated;
      element.textContent = translated;
    }
  } catch (error) {
    console.error('Translation failed:', error);
  }
}

export async function translatePage(targetLang: string) {
  if (targetLang === 'en') {
    // Restore all original text
    document.querySelectorAll('[data-original-text]').forEach((el) => {
      const original = el.getAttribute('data-original-text');
      if (original) {
        el.textContent = original;
      }
    });
    return;
  }
  
  // Translate all text elements
  const selectors = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'span', 'label', 'button',
    'a', 'li', 'td', 'th',
    '[class*="description"]',
    '[class*="title"]',
  ];
  
  const elements = document.querySelectorAll(selectors.join(','));
  const textsToTranslate: string[] = [];
  const elementsMap: HTMLElement[] = [];
  
  elements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    // Skip if element has children (only translate leaf text nodes)
    if (htmlEl.children.length === 0 && htmlEl.textContent && htmlEl.textContent.trim()) {
      const original = htmlEl.getAttribute('data-original-text') || htmlEl.textContent;
      htmlEl.setAttribute('data-original-text', original);
      textsToTranslate.push(original);
      elementsMap.push(htmlEl);
    }
  });
  
  // Batch translate
  if (textsToTranslate.length > 0) {
    try {
      const response = await fetch('/api/v1/translate/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texts: textsToTranslate.slice(0, 100), // Max 100 at a time
          target: targetLang,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const translations = data.translations;
        
        // Apply translations
        Object.keys(translations).forEach((index) => {
          const idx = parseInt(index);
          if (elementsMap[idx]) {
            elementsMap[idx].textContent = translations[index];
          }
        });
      }
    } catch (error) {
      console.error('Batch translation failed:', error);
    }
  }
}

