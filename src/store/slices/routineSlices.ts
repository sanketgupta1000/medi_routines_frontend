import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Routine } from "../../services/routineService";

// type of state for the routines
interface RoutinesState
{
    routines: Routine[];
}

// the actual initial state value
const initialState: RoutinesState =
{
    routines: [],
};

export const routinesSlice = createSlice(
    {
        name: 'routine',
        initialState,
        reducers:{

            // to allow setting of routines
            // can be used right after getting the user's routines
            setRoutines: (state, action: PayloadAction<{routines: Routine[]}>)=>
            {
                state.routines = action.payload.routines;
            },

            // to add a routine
            // can be used after a successful creation of a new routine
            addRoutine: (state, action: PayloadAction<{routine: Routine}>)=>
            {
                state.routines.push(action.payload.routine);
            }

        }
    }
)

export default routinesSlice.reducer;
export const {setRoutines, addRoutine} = routinesSlice.actions;
export type {RoutinesState};