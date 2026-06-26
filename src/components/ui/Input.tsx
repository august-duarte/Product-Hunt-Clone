import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const inputStyles =
  "m-2 w-1/6 rounded-lg border border-gray-300 bg-white px-4 py-3.5 text-base text-gray-900 placeholder:text-gray-500 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100";

export function Input({ placeholder, className, ...props }: InputProps) {
  return (
    <input
      placeholder={placeholder}
      className={className ? `${inputStyles} ${className}` : inputStyles}
      {...props}
    />
  );
}
