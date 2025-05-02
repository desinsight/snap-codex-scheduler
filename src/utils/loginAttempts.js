export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCK_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
const ATTEMPT_RESET_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const STORAGE_KEY = 'loginAttempts';
const loginAttempts = new Map();
const lockTimes = new Map();
export const recordLoginAttempt = (email) => {
    const attempts = loginAttempts.get(email) || 0;
    loginAttempts.set(email, attempts + 1);
    if (attempts + 1 >= MAX_LOGIN_ATTEMPTS) {
        lockTimes.set(email, Date.now());
    }
};
export const isAccountLocked = (email) => {
    const lockTime = lockTimes.get(email);
    if (!lockTime)
        return false;
    const timePassed = Date.now() - lockTime;
    return timePassed < LOCK_DURATION;
};
export const clearLoginAttempts = (email) => {
    loginAttempts.delete(email);
    lockTimes.delete(email);
};
export function getLoginAttempts() {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) {
        return { attempts: [] };
    }
    try {
        const data = JSON.parse(storedData);
        // Clean up old attempts
        const now = Date.now();
        data.attempts = data.attempts.filter(attempt => now - attempt.timestamp < ATTEMPT_RESET_DURATION);
        return data;
    }
    catch {
        return { attempts: [] };
    }
}
export function saveLoginAttempt(success) {
    const state = getLoginAttempts();
    const now = Date.now();
    // Add new attempt
    state.attempts.push({
        timestamp: now,
        success,
    });
    // Update locked status if necessary
    if (!success) {
        const recentFailures = state.attempts.filter(attempt => !attempt.success && now - attempt.timestamp < ATTEMPT_RESET_DURATION).length;
        if (recentFailures >= MAX_LOGIN_ATTEMPTS) {
            state.lockedUntil = now + LOCK_DURATION;
        }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
export function getRemainingLockoutTime() {
    const state = getLoginAttempts();
    const now = Date.now();
    if (state.lockedUntil && now < state.lockedUntil) {
        return Math.ceil((state.lockedUntil - now) / 1000 / 60); // Return minutes
    }
    return 0;
}
export function getFailedAttempts() {
    const state = getLoginAttempts();
    const now = Date.now();
    return state.attempts.filter(attempt => !attempt.success && now - attempt.timestamp < ATTEMPT_RESET_DURATION).length;
}
export function getRemainingAttempts() {
    return Math.max(0, MAX_LOGIN_ATTEMPTS - getFailedAttempts());
}
