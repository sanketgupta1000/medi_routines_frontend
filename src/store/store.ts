import { configureStore } from "@reduxjs/toolkit";
import { routinesReducer, userDefinedMedicinesReducer, userReducer } from "./slices";

const store = configureStore({
    reducer: {
        user: userReducer,
        userDefinedMedicines: userDefinedMedicinesReducer,
        routines: routinesReducer
    }
});

export default store;