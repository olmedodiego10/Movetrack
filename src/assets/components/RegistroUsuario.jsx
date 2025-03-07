import React, { useState, useEffect, useId } from 'react';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const FormularioRegistro = () => {
  const [datosFormulario, setDatosFormulario] = useState({
    usuario: "",
    pass: "",
    pais: ""
  });
  const idUsuario = useId();
  const idPassword = useId();
  const idPais = useId();
  const [paises, setPaises] = useState([]);
  //const [error, setError] = useState(null);
  //const [exito, setExito] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    const obtenerPaises = async () => {
      try {
        const respuesta = await fetch("https://movetrack.develotion.com/paises.php");
        const datos = await respuesta.json();

        if (datos.codigo === 200) {
          setPaises(datos.paises);
        } else {
          //setError("Error al cargar lista de países.");
          toast.error("Error al cargar lista de países.")
        }
      } catch (error) {
        //setError("Error al conectar con el servidor de países.");
        toast.error("Error al conectar con el servidor de países")
      }
    };

    obtenerPaises();
  }, []);

  const manejarCambioEntrada = (e) => {
    setDatosFormulario({ ...datosFormulario, [e.target.name]: e.target.value });
  };

  const manejarCambioPais = (valor) => {
    setDatosFormulario({ ...datosFormulario, pais: valor });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();

    // Expresiones regulares para validar usuario y contraseña
    const usuarioRegex = /^[a-zA-Z0-9]{4,}$/; // Mínimo 4 caracteres, solo letras y números
    const passRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/; // Mínimo 8 caracteres, al menos un símbolo

    if (!usuarioRegex.test(datosFormulario.usuario)) {
      toast.warn("El usuario debe tener al menos 4 caracteres (solo letras y números).");
      return;
    }

    if (!passRegex.test(datosFormulario.pass)) {
      toast.warn("La contraseña debe tener al menos 8 caracteres y un símbolo.");
      return;
    }

    const datosAEnviar = {
      usuario: datosFormulario.usuario,
      password: datosFormulario.pass,
      idPais: parseInt(datosFormulario.pais)
    };

    try {
      const respuesta = await fetch("https://movetrack.develotion.com/usuarios.php", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosAEnviar)
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        toast.error("Error en el registro. " + datos.mensaje);
        return;
      }

      const { apiKey, id } = datos;
      toast.success("Registro exitoso. Sesión iniciada automáticamente. ¡Bienvenido! 😎");
      localStorage.setItem('usuario', JSON.stringify({ apiKey, id }));
      navigate("/dashboard");
    } catch (error) {
      toast.error("Error al conectar con el servidor.");
    }
  };

  return (
    <div>
      <form onSubmit={manejarEnvio} className="login">
        <h2>Registro</h2>
        <label htmlFor={idUsuario}>Usuario</label>
        <input
          name="usuario"
          type="text"
          id={idUsuario}
          placeholder="Usuario"
          value={datosFormulario.usuario}
          onChange={manejarCambioEntrada}
          required
        />
        <label htmlFor={idPassword}>Contraseña</label>
        <input
          name="pass"
          type="password"
          id={idPassword}
          placeholder="Contraseña"
          value={datosFormulario.pass}
          onChange={manejarCambioEntrada}
          required
        />
        <label htmlFor={idPais}>País</label>
        <select id={idPais} onChange={(e) => manejarCambioPais(e.target.value)} value={datosFormulario.pais} required>
          <option value="">Selecciona tu país</option>
          {paises.map((pais) => (
            <option key={pais.id} value={pais.id}>
              {pais.name}
            </option>
          ))}
        </select>

        <button type="submit">Registrarse</button>

        <Link to="/"> ¿Ya estás registrado? Iniciar sesión </Link>
        {/* {error && <p style={{ color: 'red' }}>{error}</p>}
        {exito && <p style={{ color: 'green' }}>{exito}</p>} */}
      </form>
    </div>
  );
};

export default FormularioRegistro;
