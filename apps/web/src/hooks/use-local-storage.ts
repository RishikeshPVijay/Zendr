import { useCallback, useEffect, useSyncExternalStore } from 'react';

type Value = string | number | object | null;

const subscribe = (callback: () => void) => {
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('storage', callback);
  };
};

const getItem = (key: string) => {
  return localStorage.getItem(key);
};

const setItem = (key: string, value: string) => {
  localStorage.setItem(key, value);
  dispatchEvent(new StorageEvent('storage', { key, newValue: value }));
};

const removeItem = (key: string) => {
  localStorage.removeItem(key);
  dispatchEvent(new StorageEvent('storage', { key, newValue: null }));
};

const normalizeValue = (value: Value) => {
  switch (typeof value) {
    case 'string':
      return value;
    case 'number':
      return String(value);
    case 'object':
      return JSON.stringify(value);
    default:
      return 'null';
  }
};

const denormalizeValue = <TValue>(value: string | null): TValue => {
  if (value === null) return null as TValue;

  try {
    return JSON.parse(value) as TValue;
  } catch {
    return value as TValue;
  }
};

type SetValueAction<V> = V | ((prevValue: V) => V);

export const useLocalStorage = <V extends Value>(
  key: string,
  initialValue: V,
): [V, (value: SetValueAction<V>) => void] => {
  const getSnapshot = () => getItem(key);
  const normalizedValue = useSyncExternalStore(subscribe, getSnapshot);

  const value = denormalizeValue<V>(normalizedValue);

  const setValue = useCallback(
    (setValueAction: SetValueAction<V>) => {
      let value = setValueAction;
      if (typeof setValueAction === 'function') {
        const prevValue = getItem(key);
        value = setValueAction(denormalizeValue(prevValue));
      }

      if (value === null) {
        removeItem(key);
      } else {
        setItem(key, normalizeValue(value));
      }
    },
    [key],
  );

  useEffect(() => {
    if (initialValue !== null) {
      setItem(key, normalizeValue(initialValue));
    }
  }, [key, initialValue]);

  return [value, setValue];
};
