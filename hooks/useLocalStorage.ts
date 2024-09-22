import { useState, useEffect } from "react";

const useLocalStorage = (key: string, initialValue: string) => {
    const [storedValue, setStoredValue] = useState<string>(() => {
        if (typeof window !== "undefined") {
            const item = localStorage.getItem(key);
            return item ? item : initialValue;
        }
        return initialValue;
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem(key, storedValue);
        }
    }, [key, storedValue]);

    const setValue = (value: string) => {
        setStoredValue(value);
        if (typeof window !== "undefined") {
            localStorage.setItem(key, value);
        }
    };

    const removeValue = () => {
        setStoredValue("");
        if (typeof window !== "undefined") {
            localStorage.removeItem(key);
        }
    };

    return [storedValue, setValue, removeValue] as const;
};

export default useLocalStorage;
