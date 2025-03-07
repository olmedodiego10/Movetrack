import React from 'react'
import GrafCantSesionesPorActividad from './GrafCantSesionesPorActividad'
import GrafMinUltimosSieteDias from './GrafMinUltimosSieteDias'

const Analisis = () => {
  return (
    <div className="formulario">
      <div className="row">
        <div className="col-md-6">
          <GrafCantSesionesPorActividad />
        </div>
        <div className="col-md-6">
          <GrafMinUltimosSieteDias />
        </div>
      </div>
    </div>
  );
};

export default Analisis;