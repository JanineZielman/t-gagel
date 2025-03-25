// Set session expiration time (e.g., 1 hour)
const SESSION_EXPIRY_MS = 3600000;

// Utility function to check if localStorage is supported
const isLocalStorageSupported = () => {
    try {
        const testKey = '__test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch (error) {
        return false;
    }
};

// Utility function to validate session format
const isValidSession = (session) => {
    // Example validation: ensure it's a non-empty string
    return typeof session === 'string' && session.trim() !== '';
};

// Store session in localStorage with timestamp
export const storeSession = (session) => {
    if (!isLocalStorageSupported()) {
        console.warn('localStorage is not supported in this environment');
        return null;
    }
    if (!isValidSession(session)) {
        console.warn('Invalid session format:', session);
        return null;
    }
    try {
        const data = {
            value: session,
            timestamp: Date.now(),
        };
        localStorage.setItem('x-wc-session', JSON.stringify(data));
    } catch (error) {
        console.error('Error storing session:', error);
    }
};

// Retrieve session from localStorage
export const getSession = () => {
    if (!isLocalStorageSupported()) {
        console.warn('localStorage is not supported in this environment');
        return null;
    }
    try {
        const data = JSON.parse(localStorage.getItem('x-wc-session'));
        if (!data || Date.now() - data.timestamp > SESSION_EXPIRY_MS) {
            console.warn('Session expired or invalid');
            localStorage.removeItem('x-wc-session');
            return null;
        }
        return data.value;
    } catch (error) {
        console.error('Error retrieving session:', error);
        return null;
    }
};

// Sync session with WooCommerce backend to ensure it's valid
export const syncSession = async () => {
    try {
        const session = getSession();
        if (!session) {
            console.warn('No session to sync');
            return;
        }
        const response = await fetch('/wp-json/wc/v3/session/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-wc-session': session,
            },
            credentials: 'include',
        });
        const data = await response.json();
        if (!data.valid) {
            console.warn('Session is invalid, clearing local storage');
            localStorage.removeItem('x-wc-session');
        }
    } catch (error) {
        console.error('Error syncing session:', error);
    }
};

// Clear session from localStorage
export const clearSession = () => {
    try {
        localStorage.removeItem('x-wc-session');
        console.log('Session cleared');
    } catch (error) {
        console.error('Error clearing session:', error);
    }
};
