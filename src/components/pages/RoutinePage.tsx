import { useParams } from "react-router";
import { useAppSelector } from "../../store/hooks";
import Header from "../ui/Header";
import { Link } from "react-router";

// Define types based on actual data structure
interface Medicine {
    id: string;
    name: string;
}

interface Schedule {
    day: string;
    times: string[];
}

interface RoutineMedicine {
    id: string;
    medicine: Medicine;
    schedule: Schedule[];
    medicineId?: string; // Optional depending on your actual structure
}

interface TakenMedicine {
    date: string;
    day: string;
    time: string;
    routineMedicine: string;
}

// Define type for our data grouping
interface TakenGroup {
    date: string;
    day: string;
    time: string;
    medicines: Record<string, boolean>;
}

function RoutinePage() {
    const { routineId } = useParams<{ routineId: string }>();
    const routines = useAppSelector(state => state.routines.routines);
    
    // Find the routine by ID
    const routine = routines.find(r => r.id === routineId);
    
    // If routine not found
    if (!routine) {
        return (
            <div>
                <Header />
                <h2>Routine not found</h2>
                <Link to="/routines">Back to Routines</Link>
            </div>
        );
    }
    
    // Group taken medicines by date and time for display
    const takenByDateTime: Record<string, TakenGroup> = {};
    
    // First, create the map with all dates and times
    if (routine.takenMedicines && Array.isArray(routine.takenMedicines)) {
        routine.takenMedicines.forEach((taken: TakenMedicine) => {
            const key = `${taken.date}-${taken.time}`;
            if (!takenByDateTime[key]) {
                takenByDateTime[key] = {
                    date: taken.date,
                    day: taken.day,
                    time: taken.time,
                    medicines: {}
                };
            }
            
            // Mark this medicine as taken
            if (taken.routineMedicine) {
                takenByDateTime[key].medicines[taken.routineMedicine] = true;
            }
        });
    }
    
    // Convert to array and sort
    const takenGroups: TakenGroup[] = Object.values(takenByDateTime)
        .sort((a, b) => {
            // Sort by date (newest first) then by time
            if (a.date !== b.date) {
                // Parse dates in DD/MM/YYYY format
                const [dayA, monthA, yearA] = a.date.split('/').map(Number);
                const [dayB, monthB, yearB] = b.date.split('/').map(Number);
                
                const dateA = new Date(yearA, monthA - 1, dayA);
                const dateB = new Date(yearB, monthB - 1, dayB);
                
                return dateB.getTime() - dateA.getTime();
            }
            
            // Time order
            const timeOrder: Record<string, number> = { 
                "Morning": 0, 
                "Afternoon": 1, 
                "Evening": 2, 
                "Night": 3 
            };
            return (timeOrder[a.time] || 0) - (timeOrder[b.time] || 0);
        });

    return (
        <div>
            <Header />
            
            <h2>{routine.name}</h2>
            
            <div>
                <h3>Medicines in this Routine</h3>
                <ul>
                    {routine.medicines && routine.medicines.map((med) => (
                        <li key={med.id}>
                            <strong>{med.medicine?.name || "Unknown medicine"}</strong>
                            <ul>
                                {med.schedule && med.schedule.map((sched, index) => (
                                    <li key={index}>
                                        {sched.day}: {sched.times.join(", ")}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div>
                <h3>Taken History</h3>
                {takenGroups.length === 0 ? (
                    <p>No medicines have been taken yet.</p>
                ) : (
                    <div>
                        {takenGroups.map((group, groupIndex) => (
                            <div key={groupIndex} style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
                                <h4>{group.date} ({group.day}) - {group.time}</h4>
                                <ul>
                                    {routine.medicines && routine.medicines.map((med) => (
                                        <li key={med.id}>
                                            {med.medicine?.name || "Unknown medicine"}: {
                                                group.medicines[med.id] ? 
                                                <span style={{ color: "green" }}>✓ Taken</span> : 
                                                <span style={{ color: "red" }}>✗ Not Taken</span>
                                            }
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <Link to="/routines">Back to Routines</Link>
        </div>
    );
}

export default RoutinePage;