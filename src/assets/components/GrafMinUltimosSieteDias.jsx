import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
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
      text: 'Minutos invertidos en los últimos 7 días',
    },
  },
};

const GrafMinUltimosSieteDias = () => {
  const datosRegistros = useSelector(state => state.registros.sesiones);
  const [dataChart, setDataChart] = useState({ labels: [], minutos: [] });

  useEffect(() => {
    const obtenerMinutosPorDia = () => {
      if (!datosRegistros) {
        toast.error("Error al cargar datos de usuario para graficar cantidad de minutos en los últimos 7 días.")
        setDataChart(null);
        return;
      }
      const hoy = new Date();
      const ultimosSieteDias = [];

      const formatoFecha = (fecha) => {
        return fecha.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).split('/').reverse().join('-'); // Convierte a YYYY-MM-DD
      };

      for (let i = 6; i >= 0; i--) {
        const fecha = new Date(hoy);
        fecha.setDate(hoy.getDate() - i);
        ultimosSieteDias.push(formatoFecha(fecha));
      }

      const minutosPorDia = ultimosSieteDias.reduce((acc, fecha) => {
        acc[fecha] = 0;
        return acc;
      }, {});

      datosRegistros.forEach(registro => {
        if (minutosPorDia.hasOwnProperty(registro.fecha)) {
          minutosPorDia[registro.fecha] += registro.tiempo;
        }
      });

      // Formatear fechas a DD-MM
      const datosFormateados = ultimosSieteDias.map(fecha => {
        const [year, month, day] = fecha.split('-');
        return `${day}-${month}`;
      });

      setDataChart({
        labels: datosFormateados,
        minutos: ultimosSieteDias.map(fecha => minutosPorDia[fecha]),
      });
    };

    obtenerMinutosPorDia();
  }, [datosRegistros]);

  return (
    <div>
      <h1>📉 Minutos en los últimos 7 días</h1>
      {!dataChart ? (
        <p className="error">Error al cargar datos.</p>
      ) : (
        <Line
          options={options}
          data={{
            labels: dataChart.labels,
            datasets: [
              {
                fill: true,
                label: 'Minutos',
                data: dataChart.minutos,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
              },
            ],
          }}
        />
      )}

    </div>
  );
};

export default GrafMinUltimosSieteDias;