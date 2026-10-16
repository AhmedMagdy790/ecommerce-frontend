
const LAST_TOKEN_ACTIVITY_KEY = "last_token_activity_at";

export const saveLastTokenActivity = (): number => {
    const timestamp = Date.now();

    localStorage.setItem(
        LAST_TOKEN_ACTIVITY_KEY,
        String(timestamp),
    );

    return timestamp;
};

export const getLastTokenActivity = (): number | null => {
    const value = localStorage.getItem(LAST_TOKEN_ACTIVITY_KEY);

    if (!value) return null;

    const timestamp = Number(value);

    return Number.isFinite(timestamp) && timestamp > 0
        ? timestamp
        : null;
};

export const clearLastTokenActivity = (): void => {
    localStorage.removeItem(LAST_TOKEN_ACTIVITY_KEY);
};
