interface LoginAttempt {
  timestamp: number;
  success: boolean;
}

<<<<<<< HEAD
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
=======
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
const ATTEMPTS_WINDOW = 60 * 60 * 1000; // 1 hour

const getAttemptsKey = (email: string): string => `login_attempts_${email}`;

export const recordLoginAttempt = (email: string, success: boolean): void => {
<<<<<<< HEAD
  const key = `loginAttempts_${email}`;
  const attempts = Number(localStorage.getItem(key) || '0');

  if (success) {
    localStorage.setItem(key, '0');
    localStorage.removeItem(`lockTime_${email}`);
  } else {
    localStorage.setItem(key, String(attempts + 1));
    if (attempts + 1 >= MAX_LOGIN_ATTEMPTS) {
      localStorage.setItem(`lockTime_${email}`, String(Date.now()));
    }
  }
};

export const isAccountLocked = (email: string): boolean => {
  const attempts = Number(localStorage.getItem(`loginAttempts_${email}`) || '0');
  if (attempts < MAX_LOGIN_ATTEMPTS) {
    return false;
  }

  const lockTime = Number(localStorage.getItem(`lockTime_${email}`));
  if (!lockTime) {
    return false;
  }

  const now = Date.now();
  const timePassed = now - lockTime;

  if (timePassed >= LOCK_DURATION) {
    clearLoginAttempts(email);
    return false;
  }

  return true;
};

export const getRemainingLockTime = (email: string): number => {
  const lockTime = Number(localStorage.getItem(`lockTime_${email}`));
  if (!lockTime) {
    return 0;
  }

  const now = Date.now();
  const timePassed = now - lockTime;
  const remaining = LOCK_DURATION - timePassed;

  return Math.max(0, remaining);
};

export const clearLoginAttempts = (email: string): void => {
  localStorage.removeItem(`loginAttempts_${email}`);
  localStorage.removeItem(`lockTime_${email}`);
=======
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
>>>>>>> 8f8f5d52f92df668fcbda8e263a9e3632b7cb221
};

export const getFailedAttemptsCount = (email: string): number => {
  const attemptsKey = getAttemptsKey(email);
  const attempts: LoginAttempt[] = JSON.parse(localStorage.getItem(attemptsKey) || '[]');
  
  const now = Date.now();
  return attempts.filter(
    attempt => !attempt.success && now - attempt.timestamp < ATTEMPTS_WINDOW
  ).length;
}; 