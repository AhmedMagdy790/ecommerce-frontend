import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "px-4 py-2 rounded-full font-medium transition-all duration-200 active:scale-95";
  const variants = {
    primary: "bg-zinc-900 text-white hover:bg-zinc-700",
    secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
    ghost: "text-zinc-600 hover:text-zinc-900"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;


// components/ui/
// ├── TextField.tsx
// ├── SelectField.tsx
// ├── TextAreaField.tsx
// ├── CheckboxField.tsx
// ├── RadioGroup.tsx
// └── Button.tsx