import { useNavigate } from "react-router";
import { useAppSelector } from "../../store/hooks";
import Button from "../input/Button";
import SimpleLink from "../ui/SimpleLink";
import Header from "../ui/Header";

function AllUserDefinedMedicinesPage()
{
    const navigate = useNavigate();

    // Get user-defined medicines from Redux store (already fetched after login)
    const userDefinedMedicines = useAppSelector(state => state.userDefinedMedicines.userDefinedMedicines);

    return (
        <div>

            <Header/>

            <h2>All User Defined Medicines</h2>

            {userDefinedMedicines.length === 0 ? (
                <div>No medicines found. Add your first medicine!</div>
            ) : (
                <ul>
                    {userDefinedMedicines.map(medicine => (
                        <li key={medicine.id}>
                            {medicine.name}
                        </li>
                    ))}
                </ul>
            )}

            <Button onClick={() => navigate("/medicines/create")}>
                Create New Medicine
            </Button>

            <SimpleLink to="/routines">
                View Your Routines
            </SimpleLink>
        </div>
    );
}

export default AllUserDefinedMedicinesPage;