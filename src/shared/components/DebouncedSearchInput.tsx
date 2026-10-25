import React, { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  placeholder,
  className = '',
}) => {
  const { t, i18n } = useTranslation('debouncedSearch');
  const isArabic = (i18n.resolvedLanguage ?? i18n.language)
    .startsWith('ar');

  const [internalValue, setInternalValue] = useState(externalValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFocusedRef = useRef(false);

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Sync external updates, such as clearing the search from the parent.
  useEffect(() => {
    if (
      externalValue !== internalValue &&
      !isFocusedRef.current
    ) {
      setInternalValue(externalValue);
    }
  }, [externalValue, internalValue]);

  // Emit changes after the user stops typing.
  useEffect(() => {
    if (internalValue === externalValue) return;

    const timer = window.setTimeout(() => {
      onChangeRef.current(internalValue.trim());
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [internalValue, externalValue, debounceMs]);

  const handleClear = () => {
    setInternalValue('');
    onChangeRef.current('');
    inputRef.current?.focus();
  };

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className={`relative ${className}`}
    >
      <Search
        aria-hidden="true"
        className={`pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted ${
          isArabic ? 'right-3' : 'left-3'
        }`}
      />

      <input
        ref={inputRef}
        type="search"
        value={internalValue}
        onChange={(event) => setInternalValue(event.target.value)}
        onFocus={() => {
          isFocusedRef.current = true;
        }}
        onBlur={() => {
          isFocusedRef.current = false;

          // Sync any external change received while focused.
          setInternalValue(externalValue);
        }}
        placeholder={placeholder ?? t('placeholder')}
        aria-label={placeholder ?? t('ariaLabel')}
        className={`w-full rounded-control border border-border bg-surface py-2 text-sm text-text-primary placeholder:text-text-muted transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 ${
          isArabic
            ? 'pr-9 pl-9 text-right'
            : 'pl-9 pr-9 text-left'
        }`}
      />

      {internalValue.length > 0 && (
        <button
          type="button"
          onClick={handleClear}
          aria-label={t('clear')}
          title={t('clear')}
          className={`absolute top-1/2 -translate-y-1/2 rounded-control p-1 text-text-muted transition-colors hover:bg-surface-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
            isArabic ? 'left-2' : 'right-2'
          }`}
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};