import { useNavigate } from "react-router";
import { Link } from "react-router";
import { useAppSelector } from "../../store/hooks";
import Button from "../input/Button";
import Header from "../ui/Header";

function AllRoutinesPage() {
    const navigate = useNavigate();
    
    // Get routines directly from Redux store (assume already fetched)
    const routines = useAppSelector(state => state.routines.routines);
    
    return (
        <div>
            <Header />
            
            <h2>Your Routines</h2>
            
            {routines.length === 0 ? (
                <div>No routines found. Create your first routine!</div>
            ) : (
                <ul>
                    {routines.map((routine, index) => (
                        <li key={routine.id}>
                            <Link to={`/routines/${index}`}>
                                <h3>{routine.name}</h3>
                                
                                {/* Display medicines in this routine */}
                                <p>Medicines:</p>
                                <ul>
                                    {routine.medicines && routine.medicines.map((med, index) => (
                                        <li key={index}>
                                            {med.medicine.name}
                                        </li>
                                    ))}
                                </ul>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
            
            <Button onClick={() => navigate("/routines/create")}>
                Create New Routine
            </Button>
            
            <Link to="/routines/upcoming">
                View Upcoming Routines
            </Link>
        </div>
    );
}

export default AllRoutinesPage;