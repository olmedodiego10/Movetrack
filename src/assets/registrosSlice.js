import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    sesiones: []
}

export const registrosSlice = createSlice({
    name: "registros",
    initialState,
    reducers: {
        //Guarda y sobrescribe todas las sesiones
        guardarRegistroSesiones: (state, action) => {
            state.sesiones = action.payload.map(sesion => ({
                ...sesion,
                imagen: ""
            }));
        },
        //Agrega una nueva sesión sin borrar las anteriores
        registrarSesion: (state, action) => {
            state.sesiones.push({
                ...action.payload,
                imagen: ""
            });
        },
        eliminarSesion: (state, action) => {
            state.sesiones = state.sesiones.filter((sesion) => sesion.id !== action.payload);
        }, 
    }
})

export const { guardarRegistroSesiones, registrarSesion, eliminarSesion } = registrosSlice.actions;
export default registrosSlice.reducer;