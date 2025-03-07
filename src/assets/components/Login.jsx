import React, { useEffect, useId, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const FormularioLogin = () => {
  const [datosLogin, setDatosLogin] = useState({
    usuario: "",
    password: ""
  });
  const idUsuario = useId();
  const idPassword = useId();
  //const [error, setError] = useState(null);
  //const [exito, setExito] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("usuario") !== null) {
      navigate("/dashboard");
    }
  }, [])


  const manejarCambioEntrada = (e) => {
    setDatosLogin({ ...datosLogin, [e.target.name]: e.target.value });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    //setError(null);
    //setExito(null);

    try {
      const respuesta = await fetch('https://movetrack.develotion.com/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosLogin)
      });
      const datos = await respuesta.json();
      if (!respuesta.ok) {
        //setError(datos.mensaje || 'Error en el inicio de sesión.');
        toast.error("Error en el inicio de sesión. " + datos.mensaje);
        return;
      }

      const { apiKey, id } = datos;
      //setExito(`Bienvenido de nuevo, usuario con ID ${id} y apiKey ${apiKey}`);
      localStorage.setItem('usuario', JSON.stringify({ apiKey, id }));
      toast.success("Sesión iniciada con éxito. ¡Bienvenido! 😎")
      navigate("/dashboard");
    } catch (error) {
      //setError('Error al conectar con el servidor.');
      toast.error("Error al conectar con el servidor.");
    }
  };

  return (
    <div>
      <form onSubmit={manejarEnvio} className="login">
        <h2>Iniciar sesión</h2>
        <label htmlFor={idUsuario}>Usuario</label>
        <input
          name="usuario"
          type="text"
          id={idUsuario}
          placeholder="Usuario"
          value={datosLogin.usuario}
          onChange={manejarCambioEntrada}
          required
        />

        <label htmlFor={idPassword}>Contraseña</label>
        <input
          name="password"
          type="password"
          id={idPassword}
          placeholder="Contraseña"
          value={datosLogin.password}
          onChange={manejarCambioEntrada}
          required
        />

        <button
          type="submit"
          className={`btn btn-primary ${(!datosLogin.usuario || !datosLogin.password) ? "disabled" : ""}`}
        >
          Ingresar
        </button>

        <Link to="/registro"> Registrarse </Link>
        {/* {error && <p style={{ color: 'red' }}>{error}</p>}
        {exito && <p style={{ color: 'green' }}>{exito}</p>} */}
      </form>
    </div>
  );
};

export default FormularioLogin;
