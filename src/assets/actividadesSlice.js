import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    actividades: []
}

export const actividadesSlice = createSlice({
    name: "actividades",
    initialState,
    reducers: {
        //Guarda y sobrescribe todas las actividades
        guardarActividades: (state, action) => {
            state.actividades = action.payload.map(actividad => ({
                ...actividad
            }));
        }, 
    }
})

export const { guardarActividades } = actividadesSlice.actions;
export default actividadesSlice.reducer;