import React, { useId } from 'react';

// will create a general checkbox
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement>
{
    label?: string;
    className?: string;
    ref: React.Ref<HTMLInputElement>
};

function Checkbox({
    label="",
    className="",
    ref,
    ...rest
}: CheckboxProps)
{
    const id = useId();

    return (

        <div>

            {/* label if any */}
            {label &&
            
                <label
                    htmlFor={id}
                >
                    {label}
                </label>

            }

            <input
                type="checkbox"
                id={id}
                className={` ${className}`}
                ref={ref}
                {...rest}
            />

        </div>

    );
}

export default Checkbox;
export type {CheckboxProps};