/**
 * Common validation utilities
 */

export const validators = {
  /**
   * Validate email format
   */
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate password strength
   */
  password: (password: string): { valid: boolean; message?: string } => {
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters' };
    }

    if (!/[a-z]/.test(password)) {
      return { valid: false, message: 'Password must contain lowercase letter' };
    }

    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'Password must contain uppercase letter' };
    }

    if (!/[0-9]/.test(password)) {
      return { valid: false, message: 'Password must contain a number' };
    }

    return { valid: true };
  },

  /**
   * Validate phone number
   */
  phone: (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-()]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  },

  /**
   * Validate URL
   */
  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Validate price
   */
  price: (price: string | number): boolean => {
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return !isNaN(num) && num >= 0;
  },

  /**
   * Validate required field
   */
  required: (value: any): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    return true;
  },

  /**
   * Validate file type
   */
  fileType: (file: File, allowedTypes: string[]): boolean => {
    return allowedTypes.some((type) => file.type.includes(type));
  },

  /**
   * Validate file size (in MB)
   */
  fileSize: (file: File, maxSizeMB: number): boolean => {
    return file.size <= maxSizeMB * 1024 * 1024;
  },
};

