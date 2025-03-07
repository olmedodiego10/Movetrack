import React, { useEffect, useState } from 'react';
import AgregarRegistroEjercicio from './RegistroSesionEjercicio';
import ListadoRegistros from './ListadoRegistros';
import { useDispatch } from 'react-redux';
import { guardarRegistroSesiones } from '../registrosSlice';
import { guardarActividades } from '../actividadesSlice';
import { useNavigate } from 'react-router';
import TiempoTotal from './TiempoTotal';
import TiempoDiario from './TiempoDiario';
import Analisis from './Analisis';
import EvaluacionPersonal from './EvaluacionPersonal';

const Dashboard = () => {
  const dispatch = useDispatch();
  //const [error, setError] = useState(null);
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  let navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      if (!usuario) {
        navigate('/');
      }

      try {
        const respuestaRegistros = await fetch(
          `https://movetrack.develotion.com/registros.php?idUsuario=${usuario.id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              apikey: usuario.apiKey,
              iduser: usuario.id,
            },
          }
        );

        const datosRegistros = await respuestaRegistros.json();
        dispatch(guardarRegistroSesiones(datosRegistros.registros));

        if (datosRegistros.codigo !== 200) {
          //setError('Error al cargar sesiones de ejercicio.');
          toast.error("Error al cargar sesiones de ejercicio.")
          return;
        }

        const respuestaActividadesDisponibles = await fetch('https://movetrack.develotion.com/actividades.php', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'apikey': usuario.apiKey,
            'iduser': usuario.id
          }
        });
        const datosActividades = await respuestaActividadesDisponibles.json();

        if (datosActividades.codigo !== 200) {
          //setError("Error al cargar actividades disponibles.");
          toast.error("Error al cargar actividades disponibles.")
          return;
        }
        dispatch(guardarActividades(datosActividades.actividades));

      } catch (error) {
        //setError('Error al conectar con el servidor.');
        toast.error("Error al conectar con el servidor.")
      }
    };

    cargarDatos();
  }, []);

  const manejarLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/');
  };

  return (
    <div className="container dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <a className="logout-link" onClick={manejarLogout}>Cerrar sesión</a>
      </div>

      {/* Fila 1: AgregarRegistroEjercicio */}
      <div className="row mb-3">
        <div className="col-12">
          <AgregarRegistroEjercicio />
        </div>
      </div>

      {/* Fila 2: ListadoRegistros */}
      <div className="row mb-3">
        <div className="col-12">
          <ListadoRegistros />
        </div>
      </div>

      {/* Fila 3: Análisis con gráficos */}
      <div className="row mb-3">
        <div className="col-12">
          <Analisis />
        </div>
      </div>

      {/* Fila 4: TiempoTotal, TiempoDiario, EvaluacionPersonal */}
      <div className="row">
        <div className="col-md-4">
          <TiempoTotal />
        </div>
        <div className="col-md-4">
          <TiempoDiario />
        </div>
        <div className="col-md-4">
          <EvaluacionPersonal />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;