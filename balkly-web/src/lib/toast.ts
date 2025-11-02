// Simple toast notification utility

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  title?: string;
  description: string;
  type?: ToastType;
  duration?: number;
}

class ToastManager {
  show(options: ToastOptions) {
    // Simple implementation - can be enhanced with sonner or toast library
    const { title, description, type = 'info', duration = 3000 } = options;
    
    if (typeof window !== 'undefined') {
      // For now, use simple alert
      // TODO: Implement proper toast UI with sonner
      const message = title ? `${title}: ${description}` : description;
      
      if (type === 'error') {
        alert(`❌ ${message}`);
      } else if (type === 'success') {
        alert(`✅ ${message}`);
      } else {
        alert(message);
      }
    }
  }

  success(description: string, title?: string) {
    this.show({ description, title, type: 'success' });
  }

  error(description: string, title?: string) {
    this.show({ description, title, type: 'error' });
  }

  info(description: string, title?: string) {
    this.show({ description, title, type: 'info' });
  }

  warning(description: string, title?: string) {
    this.show({ description, title, type: 'warning' });
  }
}

export const toast = new ToastManager();

