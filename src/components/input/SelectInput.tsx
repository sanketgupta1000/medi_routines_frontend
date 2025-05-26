import React, { useId } from 'react'

// a general select input component

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement>
{
    label?: string;
    options: { value: string; label: string }[];
    className?: string;
    ref: React.Ref<HTMLSelectElement>;
}

function SelectInput({
    label="",
    options,
    className="",
    ref,
    ...rest
}: SelectInputProps)
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

            {/* underlying select input */}
            <select
                id={id}
                className={` ${className}`}
                ref={ref}
                {...rest}
            >

                {/* please select option */}
                <option value="">Please select</option>

                {options.map((opt)=>
                
                    <option
                        key={opt.value}
                        value={opt.value}
                    >
                        {opt.label}
                    </option>

                )}

            </select>

        </div>

    );
}

export default SelectInput;
export type {SelectInputProps};