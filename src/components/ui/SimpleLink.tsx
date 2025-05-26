import React from 'react'
import { Link, type LinkProps } from 'react-router';

interface SimpleLinkProps extends LinkProps
{
    to: string;
    className?: string;
    children: React.ReactNode;
};

function SimpleLink({
    to,
    className="",
    children,
    ...props
}: SimpleLinkProps)
{

    return (

        <Link
            to={to}
            className={`hover:underline ${className}`}
            {...props}
        >
            {children}
        </Link>

    );

}

export default SimpleLink;