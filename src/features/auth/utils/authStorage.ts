
const HAS_LOGGED_IN_KEY = "has_logged_in";

export const hasLoggedInBefore = (): boolean => {
    return localStorage.getItem(HAS_LOGGED_IN_KEY) === "true";
};

export const setHasLoggedIn = (): void => {
    localStorage.setItem(HAS_LOGGED_IN_KEY, "true");
};

export const clearHasLoggedIn = (): void => {
    localStorage.removeItem(HAS_LOGGED_IN_KEY);
};
