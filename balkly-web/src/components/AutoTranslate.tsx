"use client";

import { useEffect } from 'react';

export default function AutoTranslate() {
  useEffect(() => {
    const currentLang = localStorage.getItem('language') || 'en';
    
    if (currentLang !== 'en') {
      // Wait for page to fully load
      setTimeout(() => {
        translatePage(currentLang);
      }, 1000);
    }
    
    // Listen for language changes
    const handleLanguageChange = (e: any) => {
      translatePage(e.detail.language);
    };
    
    window.addEventListener('language-change', handleLanguageChange);
    
    return () => {
      window.removeEventListener('language-change', handleLanguageChange);
    };
  }, []);
  
  return null; // No UI
}

async function translatePage(targetLang: string) {
  if (targetLang === 'en') {
    // Restore original text
    document.querySelectorAll('[data-original-text]').forEach((el) => {
      const original = el.getAttribute('data-original-text');
      if (original) {
        el.textContent = original;
      }
    });
    return;
  }
  
  // Collect text elements
  const selectors = 'h1, h2, h3, h4, h5, h6, p, span, label, button, a';
  const elements = document.querySelectorAll(selectors);
  const textsToTranslate: string[] = [];
  const elementsMap: HTMLElement[] = [];
  
  elements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    // Skip if has children or empty
    if (htmlEl.children.length === 0 && htmlEl.textContent && htmlEl.textContent.trim().length > 1) {
      const original = htmlEl.getAttribute('data-original-text') || htmlEl.textContent;
      htmlEl.setAttribute('data-original-text', original);
      textsToTranslate.push(original);
      elementsMap.push(htmlEl);
    }
  });
  
  // Batch translate (max 100 at a time)
  if (textsToTranslate.length > 0) {
    try {
      const response = await fetch('/api/v1/translate/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texts: textsToTranslate.slice(0, 100),
          target: targetLang,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        Object.keys(data.translations).forEach((index) => {
          const idx = parseInt(index);
          if (elementsMap[idx]) {
            elementsMap[idx].textContent = data.translations[index];
          }
        });
        console.log(`✅ Translated ${Object.keys(data.translations).length} elements to ${targetLang}`);
      }
    } catch (error) {
      console.error('Translation failed:', error);
    }
  }
}

