import { configureStore } from "@reduxjs/toolkit";
import registrosReducer from "../assets/registrosSlice";
import actividadesReducer from "../assets/actividadesSlice";

export const store = configureStore({
    reducer: {
        registros: registrosReducer,
        actividades : actividadesReducer
    }
})