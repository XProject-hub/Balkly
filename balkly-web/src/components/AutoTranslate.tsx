"use client";

import { useEffect } from 'react';

export default function AutoTranslate() {
  useEffect(() => {
    console.log('🌍 AutoTranslate component mounted');
    const currentLang = localStorage.getItem('language') || 'en';
    console.log('🌍 Current language from localStorage:', currentLang);
    
    if (currentLang !== 'en') {
      console.log('🌍 Will translate to:', currentLang, 'in 1 second');
      // Wait for page to fully load
      setTimeout(() => {
        console.log('🌍 Starting translation...');
        translatePage(currentLang);
      }, 1000);
    } else {
      console.log('🌍 Language is EN, skipping translation');
    }
    
    // Listen for language changes
    const handleLanguageChange = (e: any) => {
      console.log('🌍 Language change event received:', e.detail.language);
      translatePage(e.detail.language);
    };
    
    window.addEventListener('language-change', handleLanguageChange);
    console.log('🌍 Language change listener registered');
    
    return () => {
      window.removeEventListener('language-change', handleLanguageChange);
    };
  }, []);
  
  return null; // No UI
}

async function translatePage(targetLang: string) {
  console.log('🌍 translatePage called with target:', targetLang);
  
  if (targetLang === 'en') {
    console.log('🌍 Restoring to English (original)');
    // Restore original text
    document.querySelectorAll('[data-original-text]').forEach((el) => {
      const original = el.getAttribute('data-original-text');
      if (original) {
        el.textContent = original;
      }
    });
    return;
  }
  
  // Determine source language
  // If translating TO English, source is Balkly content (Bosnian)
  // If translating TO Balkly, source is English
  const sourceLang = targetLang === 'en' ? 'bs' : 'en';
  
  console.log('🌍 Source language:', sourceLang, '→ Target:', targetLang);
  
  // Collect text elements
  const selectors = 'h1, h2, h3, h4, h5, h6, p, span, label, button, a';
  const elements = document.querySelectorAll(selectors);
  const textsToTranslate: string[] = [];
  const elementsMap: HTMLElement[] = [];
  
  elements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    const text = htmlEl.textContent?.trim() || '';
    
    // Skip if:
    // - Has children
    // - Empty or too short
    // - Is a currency code (EUR, AED, USD, GBP, etc.)
    // - Is only numbers or symbols
    // - Contains price/currency symbols
    const skipPatterns = [
      /^(EUR|AED|USD|GBP|BAM|RSD|EVP|د\.إ|€|\$|£)$/i,  // Currency codes (added EVP)
      /^\d+$/,  // Only numbers
      /^[\d\s\.\,\-]+$/,  // Numbers with formatting
      /^[€\$£د\.إ\d\s\.\,]+$/,  // Prices
      /(EUR|AED|USD|EVP)/i,  // Contains currency code anywhere
    ];
    
    const shouldSkip = htmlEl.children.length > 0 || 
                      text.length < 2 || 
                      skipPatterns.some(pattern => pattern.test(text));
    
    if (!shouldSkip) {
      const original = htmlEl.getAttribute('data-original-text') || text;
      htmlEl.setAttribute('data-original-text', original);
      textsToTranslate.push(original);
      elementsMap.push(htmlEl);
    }
  });
  
  // Batch translate in smaller chunks (20 at a time for faster response)
  console.log('🌍 Found', textsToTranslate.length, 'texts to translate');
  
  if (textsToTranslate.length > 0) {
    // Show loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'translation-loading';
    loadingDiv.style.cssText = 'position:fixed;top:70px;right:20px;background:#1E63FF;color:white;padding:12px 20px;border-radius:8px;z-index:9999;box-shadow:0 4px 6px rgba(0,0,0,0.1);font-size:14px;font-weight:500;';
    loadingDiv.textContent = `🌍 Translating ${textsToTranslate.length} items...`;
    document.body.appendChild(loadingDiv);
    
    try {
      console.log('🌍 Calling API /api/v1/translate/batch with', Math.min(textsToTranslate.length, 20), 'texts');
      const response = await fetch('/api/v1/translate/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texts: textsToTranslate.slice(0, 20), // Only 20 at a time for speed
          target: targetLang,
          source: sourceLang,
        }),
      });
      
      console.log('🌍 API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('🌍 Translation data received:', data);
        Object.keys(data.translations).forEach((index) => {
          const idx = Number.parseInt(index, 10);
          if (elementsMap[idx]) {
            elementsMap[idx].textContent = data.translations[index];
          }
        });
        console.log(`✅ Translated ${Object.keys(data.translations).length} elements to ${targetLang}`);
        
        // Remove loading indicator
        setTimeout(() => {
          const loader = document.getElementById('translation-loading');
          if (loader) loader.remove();
        }, 500);
      } else {
        console.error('🌍 API response not OK:', await response.text());
        const loader = document.getElementById('translation-loading');
        if (loader) {
          loader.style.background = '#EF4444';
          loader.textContent = '❌ Translation failed';
          setTimeout(() => loader.remove(), 2000);
        }
      }
    } catch (error) {
      console.error('🌍 Translation failed:', error);
      const loader = document.getElementById('translation-loading');
      if (loader) {
        loader.style.background = '#EF4444';
        loader.textContent = '❌ Translation error';
        setTimeout(() => loader.remove(), 2000);
      }
    }
  } else {
    console.log('🌍 No texts to translate');
  }
}

