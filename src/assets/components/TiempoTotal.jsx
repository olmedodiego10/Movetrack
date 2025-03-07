import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const TiempoTotal = () => {
    const datosRegistros = useSelector(state => state.registros.sesiones);
    const [tiempoTotal, setTiempoTotal] = useState(0);

    useEffect(() => {
        const calcularTiempoTotal = () => {
            if (!datosRegistros) {
                toast.error("Error al cargar datos de tiempo total.")
                return "Error al cargar datos de usuario."
            } else {
                return datosRegistros?.reduce((total, registro) => total + registro.tiempo, 0) || 0;
            }
        };

        setTiempoTotal(calcularTiempoTotal());
    }, [datosRegistros]);

    return (
        <div className="formulario">
        <h1>🔹 Tiempo invertido total:</h1>
        {typeof tiempoTotal === 'string' ? ( // Verifica si tiempoTotal es una cadena
            <p className="error">{tiempoTotal}</p> // Muestra el mensaje de error
        ) : (
            <h2 className="h2-centrado">{tiempoTotal} minutos 🕧🔥</h2>
        )}
    </div>
    );
};

export default TiempoTotal;
