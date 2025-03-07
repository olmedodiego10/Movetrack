import React, { useState, useEffect, useId } from 'react';
import { registrarSesion } from '../registrosSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';

const AgregarRegistroEjercicio = () => {
  const [nuevaSesion, setNuevaSesion] = useState({
    actividad: "",
    tiempo: "",
    fecha: "",
  });
  const idActividad = useId();
  const idTiempo = useId();
  const idFecha = useId();
  const dispatch = useDispatch();
  const [actividades, setActividades] = useState([]);
  let navigate = useNavigate();
  //const [error, setError] = useState(null);
  //const [exito, setExito] = useState(null);
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  useEffect(() => {
    const cargarActividades = async () => {
      //setError(null);
      if (!usuario) {
        //setError("No se encontró información del usuario.");
        toast.error("No se encontró información del usuario. Redireccionando a inicio de sesión.")
        navigate('/');
      }
      try {
        const respuesta = await fetch('https://movetrack.develotion.com/actividades.php', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'apikey': usuario.apiKey,
            'iduser': usuario.id
          }
        });

        const datos = await respuesta.json();
        if (datos.codigo !== 200) {
          //setError("Error al cargar actividades.");
          toast.error("Error al cargar actividades.");
          return;
        }

        setActividades(datos.actividades);
      } catch (error) {
        //setError("Error al conectar con el servidor.");
        toast.error("Error al conectar con el servidor.");
      }
    };

    cargarActividades();
  }, []);

  const manejarCambio = (e) => {
    setNuevaSesion({ ...nuevaSesion, [e.target.name]: e.target.value });
  };

  const manejarCambioActividad = (e) => {
    setNuevaSesion({
      ...nuevaSesion,
      actividad: parseInt(e.target.value)
    });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    //setError(null);
    //setExito(null);

    if (!usuario) {
      //setError("No se encontró información del usuario.");
      toast.error("No se encontró información del usuario. Redireccionando a inicio de sesión.")
      navigate('/');
    }

    const datosEnvio = {
      idActividad: nuevaSesion.actividad,
      idUsuario: usuario.id,
      tiempo: parseInt(nuevaSesion.tiempo),
      fecha: nuevaSesion.fecha
    };

    if(datosEnvio.tiempo <= 0){
      toast.warn("El tiempo debe ser mayor a 0.");
      return;
    }

    try {
      const respuesta = await fetch('https://movetrack.develotion.com/registros.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': usuario.apiKey,
          'iduser': usuario.id
        },
        body: JSON.stringify(datosEnvio),
      });

      const datos = await respuesta.json();
      if (datos.codigo === 200) {
        const datosEnvioLocal = {
          ...datosEnvio,
          id: datos.idRegistro
        };
        dispatch(registrarSesion(datosEnvioLocal));
        //setExito('Sesión guardada con éxito.');
        toast.success("¡Sesión guardada con éxito!")
      } else {
        //setError(datos.mensaje || 'Error al guardar la sesión.');
        toast.error("Error al guardar la sesión. " + datos.mensaje)
      }
    } catch (error) {
      //setError('Error al conectar con el servidor.');
      toast.error("Error al conectar con el servidor.")
    } finally {
      setNuevaSesion({ actividad: '', tiempo: '', fecha: '' });
    }
  };

  const obtenerFechaLocal = () => {
    const hoy = new Date();
    const fechaFormateada = hoy.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).split('/').reverse().join('-'); // Convierte DD/MM/YYYY a YYYY-MM-DD
    return fechaFormateada;
  };

  return (
    <div className="dashboard-content">
      <form onSubmit={manejarEnvio} className="formulario">
        <h1>📇 Agregar sesión de ejercicio</h1>
        <label htmlFor={idActividad}>Actividad:</label>
        <select
          id={idActividad}
          name="actividad"
          value={nuevaSesion.actividad}
          onChange={manejarCambioActividad}
          required
        >
          <option value="">Selecciona una actividad</option>
          {actividades.map((actividad) => (
            <option key={actividad.id} value={actividad.id}>
              {actividad.nombre}
            </option>
          ))}
        </select>

        <label htmlFor={idTiempo}>Tiempo (minutos):</label>
        <input
          type="number"
          id={idTiempo}
          name="tiempo"
          value={nuevaSesion.tiempo}
          onChange={manejarCambio}
          required
        />

        <label htmlFor={idFecha}>Fecha:</label>
        <input
          type="date"
          id={idFecha}
          name="fecha"
          value={nuevaSesion.fecha}
          onChange={manejarCambio}
          max={obtenerFechaLocal()}
          required
        />

        <button type="submit">Guardar sesión</button>

        {/* {error && <p className="error">{error}</p>}
        {exito && <p className="exito">{exito}</p>} */}
      </form>
    </div>
  );
};

export default AgregarRegistroEjercicio;