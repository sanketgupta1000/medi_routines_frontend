import React, { useId } from 'react'

// creating a general input box

// type can only be text, password, email, number
// label is the label for the input box
// placeholder is the placeholder for the input box
// className is the class name for the input box
// initialValue is the initial value for the input box
// ref is the ref for the input box
// props is the rest of the props for the input box

// extending the input html attributes, so that we can use all the input html attributes
// and also our custom attributes
interface InputBoxProps extends React.InputHTMLAttributes<HTMLInputElement>
{
    type?: "text" | "password" | "email" | "number";
    label?: string;
    placeholder?: string;
    className?: string;
    ref: React.Ref<HTMLInputElement>;
};

function InputBox(
    {
        type = "text",
        label = "",
        placeholder = "",
        className = "",
        // to get access to underlying input element
        ref,
        ...rest
    }: InputBoxProps
)
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

            {/* the actual underlying input ele */}
            <input
                type={type}
                className={` ${className}`}
                placeholder={placeholder}
                id={id}
                ref={ref}
                {...rest}
            />

        </div>

    )
}

export default InputBox;
export type { InputBoxProps };