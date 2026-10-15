// src/shared/components/DebouncedSearchInput.tsx
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface DebouncedSearchInputProps {
  value?: string;
  onChange: (value: string) => void;
  debounceMs?: number;
  placeholder?: string;
  className?: string;
}

export const DebouncedSearchInput: React.FC<DebouncedSearchInputProps> = ({
  value: externalValue = '',
  onChange,
  debounceMs = 400,
  placeholder = 'ابحث...',
  className = '',
}) => {
  const [internalState, setInternalState] = useState(() => ({
    externalValue,
    value: externalValue,
  }));
  const internalValue =
    internalState.externalValue === externalValue
      ? internalState.value
      : externalValue;
  const setInternalValue = (value: string) =>
    setInternalState({ externalValue, value });

  // إرسال التحديث للخارج بعد انتهاء زمن التأخير
  useEffect(() => {
    const timer = setTimeout(() => {
      if (internalValue !== externalValue) {
        onChange(internalValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [internalValue, externalValue, onChange, debounceMs]);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
      <input
        type="text"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[var(--radius-md)] border border-[var(--input-border)] bg-[var(--input-bg)] py-2 pr-9 pl-9 text-[var(--text-sm)] text-[var(--color-text-primary)] focus:border-[var(--input-focus)] focus:outline-none"
      />
      {internalValue && (
        <button
          type="button"
          onClick={() => {
            setInternalValue('');
            onChange('');
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};