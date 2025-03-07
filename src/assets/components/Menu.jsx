import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
//obsoleto, si esto sigue aqui es porque me olvide de eliminarlo previo a la entrega
const Menu = () => {
  const [usuarioLogueado, setUsuarioLogueado] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      setUsuarioLogueado(true);
    }
  }, []);

  const manejarLogout = () => {
    localStorage.removeItem('usuario');
    console.log('Usuario eliminado del localStorage');
    setUsuarioLogueado(false);
    navigate("/");
  };

  return (
      <div className="menu">
        {usuarioLogueado && (
            <button className="logout-button" onClick={manejarLogout}>
              Logout
            </button>
        )}
        <Outlet />
      </div>
  );
};

export default Menu;
