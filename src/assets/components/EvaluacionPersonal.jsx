import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const EvaluacionPersonal = () => {
    const datosRegistros = useSelector(state => state.registros.sesiones);
    const [mensaje, setMensaje] = useState(null);

    useEffect(() => {
        if (!datosRegistros) {
            toast.error("Error al cargar los datos de evaluación personal.");
            setMensaje(null);
            return;
        }

        const obtenerTiempoPorDia = (fecha) => {
            return datosRegistros
                ?.filter(registro => registro.fecha === fecha)
                .reduce((total, registro) => total + registro.tiempo, 0) || 0;
        };

        const formatoFecha = (fecha) => {
            return fecha.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }).split('/').reverse().join('-'); // Convierte a YYYY-MM-DD
        };

        const hoy = new Date();
        const ayer = new Date();
        ayer.setDate(hoy.getDate() - 1);
        const tiempoHoy = obtenerTiempoPorDia(formatoFecha(hoy));
        const tiempoAyer = obtenerTiempoPorDia(formatoFecha(ayer));

        setMensaje(tiempoHoy > tiempoAyer ? "¡Bien hecho! 🎉🥇" : "¡Que no decaiga! 💪🥈");
    }, [datosRegistros]);

    return (
        <div className="formulario">
            <h1>📝Evaluación personal:</h1>
            {mensaje === null ? (
                <p className="error">Error al cargar datos.</p>
            ) : (
                <h2>{mensaje}</h2>
            )}
        </div>
    );
};

export default EvaluacionPersonal;
