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
        <div className="max-w-3xl mx-auto px-4 py-6">
            
            <h2 className="text-2xl font-semibold mb-6">Your Routines</h2>
            
            {routines.length === 0 ? (
                <div className="text-gray-600 bg-gray-100 p-4 rounded-md text-center">
                    No routines found. Create your first routine!
                </div>
            ) : (
                <ul className="space-y-4 mb-6">
                    {routines.map((routine, index) => (
                        <li key={routine.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <Link to={`/routines/${index}`} className="block">
                                <h3 className="text-xl font-medium text-blue-600 mb-2">{routine.name}</h3>
                                
                                {/* Display medicines in this routine */}
                                <p className="text-sm font-medium text-gray-700 mb-1">Medicines:</p>
                                <ul className="ml-4 text-gray-600">
                                    {routine.medicines && routine.medicines.map((med, index) => (
                                        <li key={index} className="text-sm py-1">
                                            {med.medicine.name}
                                        </li>
                                    ))}
                                </ul>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
            
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                <Button onClick={() => navigate("/routines/create")} className="w-full sm:w-auto">
                    Create New Routine
                </Button>
                
                <Link to="/routines/upcoming" className="text-blue-600 hover:underline text-center w-full sm:w-auto">
                    View Upcoming Routines
                </Link>
            </div>
        </div>
    );
}

export default AllRoutinesPage;