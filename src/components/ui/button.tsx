// src/components/ui/button.tsx
import React from "react";

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: "outline" | "filled";
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className, variant = "filled" }) => {
    const baseStyles = "px-4 py-2 rounded-md focus:outline-none";
    const variantStyles =
        variant === "outline" ? "border-2 border-gray-600 text-gray-600" : "bg-blue-600 text-white";

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variantStyles} ${className}`}
        >
            {children}
        </button>
    );
};

export { Button };
