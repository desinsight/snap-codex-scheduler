export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCK_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
const ATTEMPT_RESET_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface LoginAttempt {
  timestamp: number;
  success: boolean;
}

interface LoginAttemptState {
  attempts: LoginAttempt[];
  lockedUntil?: number;
}

const STORAGE_KEY = 'loginAttempts';

const loginAttempts = new Map<string, number>();
const lockTimes = new Map<string, number>();

export const recordLoginAttempt = (email: string): void => {
  const attempts = loginAttempts.get(email) || 0;
  loginAttempts.set(email, attempts + 1);

  if (attempts + 1 >= MAX_LOGIN_ATTEMPTS) {
    lockTimes.set(email, Date.now());
  }
};

export const isAccountLocked = (email: string): boolean => {
  const lockTime = lockTimes.get(email);
  if (!lockTime) return false;

  const timePassed = Date.now() - lockTime;
  return timePassed < LOCK_DURATION;
};

export const clearLoginAttempts = (email: string): void => {
  loginAttempts.delete(email);
  lockTimes.delete(email);
};

export function getLoginAttempts(): LoginAttemptState {
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (!storedData) {
    return { attempts: [] };
  }

  try {
    const data = JSON.parse(storedData) as LoginAttemptState;
    // Clean up old attempts
    const now = Date.now();
    data.attempts = data.attempts.filter(
      attempt => now - attempt.timestamp < ATTEMPT_RESET_DURATION
    );
    return data;
  } catch {
    return { attempts: [] };
  }
}

export function saveLoginAttempt(success: boolean): void {
  const state = getLoginAttempts();
  const now = Date.now();

  // Add new attempt
  state.attempts.push({
    timestamp: now,
    success,
  });

  // Update locked status if necessary
  if (!success) {
    const recentFailures = state.attempts.filter(
      attempt => !attempt.success && now - attempt.timestamp < ATTEMPT_RESET_DURATION
    ).length;

    if (recentFailures >= MAX_LOGIN_ATTEMPTS) {
      state.lockedUntil = now + LOCK_DURATION;
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getRemainingLockoutTime(): number {
  const state = getLoginAttempts();
  const now = Date.now();

  if (state.lockedUntil && now < state.lockedUntil) {
    return Math.ceil((state.lockedUntil - now) / 1000 / 60); // Return minutes
  }

  return 0;
}

export function getFailedAttempts(): number {
  const state = getLoginAttempts();
  const now = Date.now();

  return state.attempts.filter(
    attempt => !attempt.success && now - attempt.timestamp < ATTEMPT_RESET_DURATION
  ).length;
}

export function getRemainingAttempts(): number {
  return Math.max(0, MAX_LOGIN_ATTEMPTS - getFailedAttempts());
} 