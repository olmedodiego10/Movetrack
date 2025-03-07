import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: false,
            text: 'Cantidad de sesiones por actividad',
        },
    },
};

const GrafCantSesionesPorActividad = () => {
    const datosRegistros = useSelector(state => state.registros.sesiones);
    const actividades = useSelector(state => state.actividades.actividades);
    const [sesionesPorActividad, setSesionesPorActividad] = useState({ nombres: [], sesiones: [] });
    useEffect(() => {
        const obtenerSesionesPorActividad = () => {
            if(!datosRegistros){
                toast.error("Error al cargar datos de usuario para graficar cantidad de sesiones por actividad.")
                return;
            }
            if(!actividades){
                toast.error("Error al cargar actividades para graficar cantidad de sesiones por actividad.")
                return;
            }
            const conteoSesiones = {};
            datosRegistros.forEach(registro => {
                const idActividad = registro.idActividad;
                conteoSesiones[idActividad] = (conteoSesiones[idActividad] || 0) + 1;
            });
            const nombres = [];
            const sesiones = [];
            actividades.forEach(actividad => {
                const cantidadSesiones = conteoSesiones[actividad.id] || 0;
                if (cantidadSesiones > 0) {
                    nombres.push(actividad.nombre);
                    sesiones.push(cantidadSesiones);
                }
            });

            setSesionesPorActividad({ nombres, sesiones });
        };
        obtenerSesionesPorActividad();
    }, [datosRegistros, actividades]);
    return (
        <div>
            <h1>📊 Cantidad de sesiones por actividad</h1>
            {!datosRegistros || !actividades ? (
                <p className="error">Error al cargar datos.</p>
            ) : (
                <Bar
                    options={options}
                    data={{
                        labels: sesionesPorActividad.nombres,
                        datasets: [
                            {
                                label: 'Sesiones',
                                data: sesionesPorActividad.sesiones,
                                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            },
                        ],
                    }}
                />
            )}
        </div>
    );
};

export default GrafCantSesionesPorActividad;
