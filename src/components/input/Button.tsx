import React from 'react'

// a general button compoent
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>
{
    type?: "button" | "submit",
    onClick?: () => void,
    children: React.ReactNode,
    className?: string,
    disabled?: boolean,
    loading?: boolean,
}

function Button({
    type = "button",
    onClick=() => {},
    children,
    className = "",
    disabled = false,
    loading = false,
    ...rest
}: ButtonProps)
{
    return (

        <button
            type={type}
            onClick={onClick}
            className={` ${className}`}
            disabled={disabled || loading}
            {...rest}
        >
            {children}
        </button>

    );
}

export default Button;
export type { ButtonProps };