class localStorageService {
    static setItem(key: string, value: string) {
        if (typeof window !== "undefined") {
            localStorage.setItem(key, value);
        }
    }

    static getItem(key: string) {
        if (typeof window !== "undefined") {
            return localStorage.getItem(key);
        }
        return null;
    }

    static removeItem(key: string) {
        if (typeof window !== "undefined") {
            localStorage.removeItem(key);
        }
    }

    static clear() {
        if (typeof window !== "undefined") {
            localStorage.clear();
        }
    }
}

export default localStorageService;
