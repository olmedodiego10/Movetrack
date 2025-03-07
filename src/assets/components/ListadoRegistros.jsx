import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { eliminarSesion } from '../registrosSlice';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const ListadoRegistros = () => {
  const dispatch = useDispatch();
  const [sesiones, setSesiones] = useState([]);
  //const [error, setError] = useState(null);
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  let navigate = useNavigate();
  const datosRegistros = useSelector(state => state.registros.sesiones);
  const actividades = useSelector(state => state.actividades.actividades);
  const [filtroSeleccionado, setFiltroSeleccionado] = useState('todas');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      if (!usuario) {
        setCargando(false);
        //setError("No se encontró información del usuario.");
        toast.error("No se encontró información del usuario. Redireccionando a inicio de sesión.")
        navigate('/');
      }
      try {
        const registrosConImagen = datosRegistros.map(registro => {
          const actividad = actividades.find(act => act.id === registro.idActividad);
          return {
            ...registro,
            imagen: actividad ? `https://movetrack.develotion.com/imgs/${actividad.imagen}.png` : '',
            fechaFormateada: formatearFecha(registro.fecha)
          };
        });

        let sesionesFiltradas = [];
        switch (filtroSeleccionado) {
          case "semana":
            sesionesFiltradas = filtroUltimaSemana(registrosConImagen);
            break;
          case "mes":
            sesionesFiltradas = filtroUltimoMes(registrosConImagen);
            break;
          default:
            sesionesFiltradas = registrosConImagen;
            break;
        }

        sesionesFiltradas.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

        setSesiones(sesionesFiltradas);
      } catch (error) {
        //setError("Error al cargar actividades disponibles.");
        toast.error("Error al cargar actividades disponibles.")
      } finally {
        setTimeout(() => setCargando(false), 1000);
      }
    };

    cargarDatos();
  }, [datosRegistros, filtroSeleccionado, actividades]);

  const formatearFecha = (fecha) => {
    const [year, month, day] = fecha.split("-");
    return `${day}-${month}-${year}`;
  };

  const filtroUltimaSemana = (registros) => {
    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaFin.getDate() - 7);

    return registros.filter(sesion => {
      const fechaSesion = new Date(sesion.fecha);
      return fechaSesion >= fechaInicio && fechaSesion <= fechaFin;
    });
  };

  const filtroUltimoMes = (registros) => {
    const fechaFin = new Date();
    const fechaInicio = new Date(fechaFin);
    fechaInicio.setMonth(fechaFin.getMonth() - 1);

    return registros.filter(sesion => {
      const fechaSesion = new Date(sesion.fecha);
      return fechaSesion.getMonth() === fechaFin.getMonth() || fechaSesion.getMonth() === fechaInicio.getMonth();
    });
  };

  const eliminarSesionRegistrada = (id) => {
    fetch(`https://movetrack.develotion.com/registros.php?idRegistro=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "apikey": usuario.apiKey,
        "iduser": usuario.id,
      },
    })
      .then((respuesta) => respuesta.json())
      .then((datos) => {
        if (datos.codigo === 200) {
          dispatch(eliminarSesion(id));
        } else {
          console.error("Error al eliminar la sesión:", datos);
        }
      })
      .catch((error) => {
        console.error("Error de conexión al intentar eliminar la sesión:", error);
      });
  };

  return (
    <div className={`dashboard-content listado-registros`}>
      <h1>📋 Sesiones de ejercicio</h1>
      <div className="botones-filtrado d-flex flex-column flex-md-row gap-2">
        <button
          onClick={() => setFiltroSeleccionado("semana")}
          style={{ backgroundColor: filtroSeleccionado === "semana" ? "#0056b3" : "#007bff" }}
          className="formulario button"
        >
          Última semana
        </button>
        <button
          onClick={() => setFiltroSeleccionado("mes")}
          style={{ backgroundColor: filtroSeleccionado === "mes" ? "#0056b3" : "#007bff" }}
          className="formulario button"
        >
          Últimos 30 días
        </button>
        <button
          onClick={() => setFiltroSeleccionado("todas")}
          style={{ backgroundColor: filtroSeleccionado === "todas" ? "#0056b3" : "#007bff" }}
          className="formulario button"
        >
          Todas
        </button>
      </div>
      
      {cargando ? (
        <p>Cargando sesiones...</p>
      ) : sesiones.length === 0 ? (
        <p>No hay sesiones registradas.</p>
      ) : (
        <>
          {/* Encabezado de la lista */}
          <div className="list-header">
            <span>Actividad</span>
            <span>Fecha</span>
            <span>Tiempo en minutos</span>
            <span>¿Eliminar?</span>
          </div>
          
          {/* Lista de sesiones */}
          <ul>
            {sesiones.map((sesion) => (
              <li key={sesion.id} className="list-item">
                {sesion.imagen && <img src={sesion.imagen} alt="Icono faltante" />}
                <span>{sesion.fechaFormateada}</span>
                <span>{sesion.tiempo} minutos</span>
                <button onClick={() => eliminarSesionRegistrada(sesion.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );  
};

export default ListadoRegistros;
