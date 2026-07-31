import React, { type InputHTMLAttributes, forwardRef } from "react";
import { Minus, Plus } from "lucide-react";

interface InputNumberProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  isHoverPop?: boolean;
  icon?: React.ReactNode;
  containerClassName?: string;
  onValueChange?: (value: number | "") => void;
}

export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      label,
      error,
      icon,
      containerClassName = "",
      onValueChange,
      isHoverPop = false,
      min = 0,
      max,
      step = 1,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current!);

    const updateValue = (newValue: number) => {
      if (Number.isNaN(newValue)) return;

      const fixedValue = parseFloat(newValue.toFixed(10));

      if (max !== undefined && fixedValue > Number(max)) return;
      if (min !== undefined && fixedValue < Number(min)) return;

      if (inputRef.current) {
        const input = inputRef.current;
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value"
        )?.set;
        
        nativeInputValueSetter?.call(input, String(fixedValue));

        const event = new Event("input", { bubbles: true });
        input.dispatchEvent(event);
        
        if (props.onChange) {
            const changeEvent = {
                target: input,
                currentTarget: input,
            } as unknown as React.ChangeEvent<HTMLInputElement>;
            props.onChange(changeEvent);
        }

        onValueChange?.(fixedValue);
      }
    };

    const increment = () => {
      const currentVal = inputRef.current ? Number(inputRef.current.value) : 0;
      updateValue(currentVal + Number(step));
    };

    const decrement = () => {
      const currentVal = inputRef.current ? Number(inputRef.current.value) : 0;
      updateValue(currentVal - Number(step));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      
      if (props.onChange) props.onChange(e);

      if (val !== "" && !isNaN(Number(val))) {
        onValueChange?.(Number(val));
      } else if (val === "") {
        onValueChange?.("");
      }
    };

    return (
      <div className={`flex flex-col gap-2 w-full ${containerClassName} rtl`}>
        {label && (
          <label className="text-xs font-semibold text-[var(--color-text-secondary)] px-1 text-right">
            {label}
          </label>
        )}

        <div className="relative group">
          {/* Decrement Button */}
          <button
            type="button"
            onClick={decrement}
            className={`
              absolute 
              start-1.5 
              top-1/2 
              -translate-y-1/2 
              h-7 
              w-7 
              z-10 
              rounded-[var(--radius-md)] 
              ${isHoverPop ? "opacity-0 group-hover:opacity-100" : "opacity-100"} 
              flex 
              items-center 
              justify-center 
              bg-[var(--color-surface-secondary)] 
              hover:bg-[var(--color-border)] 
              text-[var(--color-text-primary)] 
              transition-all 
              cursor-pointer
              shadow-[var(--shadow-xs)]
            `}
          >
            <Minus size={13} />
          </button>

          {/* Increment Button */}
          <button
            type="button"
            onClick={increment}
            className={`
              absolute 
              end-1.5 
              top-1/2 
              -translate-y-1/2 
              h-7 
              w-7 
              z-10 
              rounded-[var(--radius-md)] 
              ${isHoverPop ? "opacity-0 group-hover:opacity-100" : "opacity-100"} 
              flex 
              items-center 
              justify-center 
              bg-[var(--color-surface-secondary)] 
              hover:bg-[var(--color-border)] 
              text-[var(--color-text-primary)] 
              transition-all 
              cursor-pointer
              shadow-[var(--shadow-xs)]
            `}
          >
            <Plus size={13} />
          </button>

          {/* Optional Icon */}
          {icon && (
            <div className="absolute start-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none z-10">
              {icon}
            </div>
          )}

          <input
            ref={inputRef}
            type="number"
            step={step}
            onChange={handleChange}
            className={`
              w-full 
              h-10 
              px-8 
              bg-[var(--color-background)] 
              border 
              ${error ? "border-[var(--color-error)]" : "border-[var(--color-border)]"} 
              rounded-[var(--radius-lg)] 
              text-[var(--color-text-primary)] 
              placeholder-[var(--color-text-muted)]
              text-center 
              font-bold 
              text-sm
              outline-none 
              transition-all 
              duration-[var(--duration-fast)]
              focus:border-[var(--color-primary)]
              focus:ring-2 
              focus:ring-[var(--color-primary)]/20
              disabled:opacity-50 
              disabled:cursor-not-allowed
              [appearance:textfield] 
              [&::-webkit-outer-spin-button]:appearance-none 
              [&::-webkit-inner-spin-button]:appearance-none
              ${icon ? "ps-9" : ""}
            `}
            {...props}
          />
        </div>

        {error && (
          <span className="text-[10px] text-[var(--color-error)] font-medium px-1 text-right">
            {error}
          </span>
        )}
      </div>
    );
  }
);

InputNumber.displayName = "InputNumber";