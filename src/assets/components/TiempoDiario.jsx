import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const TiempoDiario = () => {
    const datosRegistros = useSelector(state => state.registros.sesiones);
    const [tiempoDiario, setTiempoDiario] = useState(0);

    useEffect(() => {
        const calcularTiempoDiario = () => {
            if (!datosRegistros) {
                toast.error("Error al cargar datos de sesiones de hoy.")
                return "Error al cargar datos de usuario."
            } else {
                const hoy = new Date().toISOString().split('T')[0];
                return datosRegistros
                    ?.filter(registro => registro.fecha === hoy)
                    .reduce((total, registro) => total + registro.tiempo, 0) || 0;
            }
        };

        setTiempoDiario(calcularTiempoDiario());
    }, [datosRegistros]);

    return (
        <div className="formulario">
            <h1>🔹 Tiempo invertido en el día:</h1>
            {typeof tiempoDiario === 'string' ? ( // Verifica si tiempoDiario es una cadena (error)
                <p className="error">{tiempoDiario}</p>
            ) : (
                <h2 className="h2-centrado">{tiempoDiario} minutos 🕘🎴</h2>
            )}
        </div>
    );
};

export default TiempoDiario;