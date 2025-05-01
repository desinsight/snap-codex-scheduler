interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  maxAgeDays: number;
  historySize: number;
}

const defaultPolicy: PasswordPolicy = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxAgeDays: 90,
  historySize: 5,
};

export const validatePassword = (
  password: string,
  policy: Partial<PasswordPolicy> = {}
): { isValid: boolean; errors: string[] } => {
  const mergedPolicy = { ...defaultPolicy, ...policy };
  const errors: string[] = [];

  if (password.length < mergedPolicy.minLength) {
    errors.push(`Password must be at least ${mergedPolicy.minLength} characters long`);
  }

  if (mergedPolicy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (mergedPolicy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (mergedPolicy.requireNumbers && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (mergedPolicy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const isPasswordExpired = (lastChanged: Date, maxAgeDays: number = defaultPolicy.maxAgeDays): boolean => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastChanged.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > maxAgeDays;
};

export const generatePassword = (length: number = 16): string => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
  let password = '';
  
  // Ensure at least one of each required character type
  password += charset.match(/[A-Z]/)![0];
  password += charset.match(/[a-z]/)![0];
  password += charset.match(/[0-9]/)![0];
  password += charset.match(/[!@#$%^&*()_+]/)![0];
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}; 