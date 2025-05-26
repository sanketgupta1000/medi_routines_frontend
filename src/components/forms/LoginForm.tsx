import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import authService, { type LoginRequest } from "../../services/authService";
import { useAppDispatch } from "../../store/hooks";
import { setToken } from "../../store/slices";
import { handleErrorsBeforeLogin } from "../../utils/errors/handlers";
import InputBox from "../input/InputBox";
import InputError from "../input/InputError";
import Button from "../input/Button";
import SimpleLink from "../ui/SimpleLink";

// this component will handle the login process

type LoginData = LoginRequest;

function LoginForm()
{
    // react hook form
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<LoginData>();

    // submit loading state
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    // dispatcher
    const appDispatch = useAppDispatch();

    // function to handle login
    const onSubmit = useCallback((loginData: LoginData) =>
    {
        setSubmitLoading(true);

        authService
        .login(loginData)
        .then((loginResp) =>
        {
            // got the response
            // save the token
            appDispatch(setToken(loginResp));

        })
        .catch((err: Error) =>
        {
            console.log(err);
            // handle error
            handleErrorsBeforeLogin(err);
        })
        .finally(() =>
        {
            // stop loading
            setSubmitLoading(false);
        });

    }, [appDispatch]);    return (

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* email field */}
            <InputBox
                type='text'
                label='Email'
                placeholder='Your email'
                {...register("email", {
                    required: true,
                    pattern: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
                })}
            />
            {errors.email && <InputError>Please enter a valid email</InputError>}

            {/* password field */}
            <InputBox
                type='password'
                label='Password'
                placeholder='Password'
                {...register("password", {
                    required: true,
                    
                })}
            />
            {errors.password && <InputError>Please enter password</InputError>}

            {/* submit button */}
            <Button
                type='submit'
                loading={submitLoading}
                className="w-full"
            >
                {submitLoading ? "Logging in..." : "Login"}
            </Button>

            {/* simple link to register */}
            <div className="text-center mt-4">
                <SimpleLink
                    to='/auth/signup'
                >
                    Don't have an account? Sign up here.
                </SimpleLink>
            </div>

        </form>

    );
}

export default LoginForm;