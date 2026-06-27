import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const buttonStyles =
  "rounded-lg border border-gray-300 bg-white px-4 py-3.5 text-base text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100";

export function Button({ className, children, ...props }: ButtonProps) {
  return (
    <button className={className ? `${buttonStyles} ${className}` : buttonStyles} {...props}>
      {children}
    </button>
  );
}
