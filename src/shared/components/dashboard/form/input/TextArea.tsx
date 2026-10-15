import { type TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  placeholder = "Enter your message",
  rows = 3,
  className = "",
  containerClassName = "",
  disabled = false,
  error = "",
  hint = "",
  name,
  ...props
}, ref) => {


  // Base styles for the textarea to keep the JSX clean
  const textareaBaseStyles = `
    w-full px-3 py-2 text-sm rounded-md  disabled:cursor-not-allowed disabled:opacity-50
    h-32 form-control max-h-100
  `;

  // Dynamic styles based on the component state
  const stateStyles = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-200"
    : "border-gray-300 focus:border-blue-500 focus:ring-blue-100 dark:border-gray-700 dark:focus:ring-blue-900";

  return (
    <div className={`flex mt-5 flex-col gap-1.5 w-full ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={name}
          className="text-xs font-semibold text-gray-600 dark:text-gray-400 px-0.5 mb-1"
        >
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        id={name}
        name={name}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        aria-invalid={!!error}
        className={`${textareaBaseStyles} ${stateStyles} ${className}`}
        {...props}
      />

      {/* Error and Hint text handling */}
      {error ? (
        <span className="text-xs text-red-500 font-medium px-0.5">
          {error}
        </span>
      ) : hint ? (
        <span className="text-xs text-gray-500 px-0.5">
          {hint}
        </span>
      ) : null}
    </div>
  );
});

TextArea.displayName = "TextArea";

export default TextArea;