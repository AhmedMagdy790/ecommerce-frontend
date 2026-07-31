import { useState } from "react";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { EyeCloseIcon, EyeIcon } from "@/assets/icons";
import { UseFormRegisterReturn } from "react-hook-form";

interface PasswordInputProps {
  registerProps: UseFormRegisterReturn;
  error?: string;
}

export default function PasswordInput({ registerProps, error }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <Label>
        Password<span className="text-error-500">*</span>
      </Label>
      <div className="relative">
        <Input
          placeholder="Enter your password"
          type={showPassword ? "text" : "password"}
          {...registerProps}
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
        >
          {showPassword ? (
            <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
          ) : (
            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
          )}
        </span>
      </div>
      {error && <p className="text-xs text-error-500 mt-1">{error}</p>}
    </div>
  );
}