interface LoginAttempt {
  timestamp: number;
  success: boolean;
}

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const ATTEMPTS_WINDOW = 60 * 60 * 1000; // 1 hour

const getAttemptsKey = (email: string): string => `login_attempts_${email}`;

export const recordLoginAttempt = (email: string, success: boolean): void => {
  const attemptsKey = getAttemptsKey(email);
  const attempts: LoginAttempt[] = JSON.parse(localStorage.getItem(attemptsKey) || '[]');
  
  // Remove attempts older than the window
  const now = Date.now();
  const recentAttempts = attempts.filter(
    attempt => now - attempt.timestamp < ATTEMPTS_WINDOW
  );
  
  // Add new attempt
  recentAttempts.push({ timestamp: now, success });
  
  localStorage.setItem(attemptsKey, JSON.stringify(recentAttempts));
};

export const isAccountLocked = (email: string): boolean => {
  const attemptsKey = getAttemptsKey(email);
  const attempts: LoginAttempt[] = JSON.parse(localStorage.getItem(attemptsKey) || '[]');
  
  // Check if there are too many failed attempts
  const now = Date.now();
  const recentFailedAttempts = attempts.filter(
    attempt => !attempt.success && now - attempt.timestamp < LOCKOUT_DURATION
  );
  
  return recentFailedAttempts.length >= MAX_ATTEMPTS;
};

export const getRemainingLockoutTime = (email: string): number | null => {
  const attemptsKey = getAttemptsKey(email);
  const attempts: LoginAttempt[] = JSON.parse(localStorage.getItem(attemptsKey) || '[]');
  
  const now = Date.now();
  const recentFailedAttempts = attempts.filter(
    attempt => !attempt.success && now - attempt.timestamp < LOCKOUT_DURATION
  );
  
  if (recentFailedAttempts.length < MAX_ATTEMPTS) {
    return null;
  }
  
  const oldestAttempt = Math.min(...recentFailedAttempts.map(attempt => attempt.timestamp));
  const lockoutEndTime = oldestAttempt + LOCKOUT_DURATION;
  return Math.max(0, lockoutEndTime - now);
};

export const clearLoginAttempts = (email: string): void => {
  const attemptsKey = getAttemptsKey(email);
  localStorage.removeItem(attemptsKey);
};

export const getFailedAttemptsCount = (email: string): number => {
  const attemptsKey = getAttemptsKey(email);
  const attempts: LoginAttempt[] = JSON.parse(localStorage.getItem(attemptsKey) || '[]');
  
  const now = Date.now();
  return attempts.filter(
    attempt => !attempt.success && now - attempt.timestamp < ATTEMPTS_WINDOW
  ).length;
}; 