import { useCallback } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { logout } from "../../store/slices";
import { NavLink } from "react-router";
import Button from "../input/Button";

function Header()
{
    const isLoggedIn = useAppSelector(state => state.user.isLoggedIn);
    const dispatch = useAppDispatch();

    const handleLogout = useCallback( () => {
        dispatch(logout());
    }, [dispatch]);

    return (
        <nav>
            <ul>
                {!isLoggedIn && (
                    <>
                        <li>
                            <NavLink
                                to="/auth/signup">
                                    Signup
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/auth/login">
                                Login
                            </NavLink>
                        </li>
                    </>
                )}
                {isLoggedIn && (
                    <>
                        <li>
                            <NavLink
                                to="/routines/upcoming">
                                Upcoming Routines
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/routines"
                            >
                                All Routines
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/routines/create">
                                Create Routine
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/medicines/create">
                                Create Medicine
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/medicines">
                                All Medicines
                            </NavLink>
                        </li>
                        <li>
                            <Button
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Header;