export const storage = {
  set: <T>(key: string, value: T): void => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("STORAGE_SET_ERROR", error);
    }
  },

  get: <T>(key: string): T | null => {
    if (typeof window === "undefined") return null;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("STORAGE_GET_ERROR", error);
      return null;
    }
  },

  remove: (key: string): void => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key);
  },

  clear: (): void => {
    if (typeof window === "undefined") return;
    window.localStorage.clear();
  },
};
