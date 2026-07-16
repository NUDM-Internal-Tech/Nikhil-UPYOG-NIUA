import { useCallback, useState } from "react";

const useSessionStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const data = Digit.SessionStorage.get(key);
      return data ? data : initialValue;
    } catch (err) {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      setStoredValue((prev) => {
        try {
          const valueToStore = value instanceof Function ? value(prev) : value;
          Digit.SessionStorage.set(key, valueToStore);
          return valueToStore;
        } catch (err) {
          return prev;
        }
      });
    },
    [key]
  );

  const clearValue = useCallback(() => {
    setStoredValue(initialValue);
    try {
      Digit.SessionStorage.set(key, initialValue);
    } catch (err) {
      // ignore
    }
  }, [initialValue, key]);

  return [storedValue, setValue, clearValue];
};

export default useSessionStorage;
