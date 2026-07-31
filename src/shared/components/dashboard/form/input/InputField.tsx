import React, { forwardRef, ReactNode, useId, useState } from "react";

import {  EyeCloseIcon, EyeIcon } from "@/assets/icons";


interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  success?: boolean;
  error?: boolean;
  hint?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className = "", disabled, error, success, hint, type = "text", startIcon, endIcon, ...props }, ref) => {
    const id = useId();
    const [showPassword, setShowPassword] = useState('password');

    const baseClasses = "h-11 w-full rounded-lg border appearance-none text-sm transition-all duration-200 outline-none shadow-theme-xs placeholder:text-gray-400 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30";
    
    const stateClasses = disabled
      ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700"
      : error
      ? "border-error-500 focus:ring-4 focus:ring-error-500/10 focus:border-error-500"
      : success
      ? "border-success-500 focus:ring-4 focus:ring-success-500/10 focus:border-success-500"
      : "border-gray-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-400";

    const paddingClasses = `${startIcon ? "ps-11" : "ps-4"} ${endIcon ? "pe-11" : "pe-4"}`;

    const handlleShowPassword = () => {

      if(showPassword == "password") {
        setShowPassword("text")
      }else {
        setShowPassword("password")
      }
    }
    
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label 
            htmlFor={id} 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}

        <div className="relative group">
    
          {startIcon && (
            <div className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors">
              {startIcon}
            </div>
          )}

          <input
            id={id}
            ref={ref}
            type={type}
            disabled={disabled}
            className={`${baseClasses} ${stateClasses} ${paddingClasses} ${className}`}
            {...props}
          />

          {type == "password" && 
            <span
              onClick={handlleShowPassword}
              className="absolute end-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors"

            >
              {showPassword == "text" ? (
                <EyeIcon className="fill-gray-500" />
              ) : (
                <EyeCloseIcon className="fill-gray-500" />
              )}
            </span>
          }


          {endIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {endIcon}
            </div>
          )}
        </div>


        {hint && (
          <p className={`text-xs ${
              error ? "text-error-500" : success ? "text-success-500" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;