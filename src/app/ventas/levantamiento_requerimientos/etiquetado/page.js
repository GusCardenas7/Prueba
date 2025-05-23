import { LevantamientoEtiquetado as L } from '@/components/Ventas/Components/levantamiento_etiquetado';
import { Suspense } from 'react'
function Etiquetado() {
  return (
    <Suspense>
    <div>
      <L />
    </div>
    </Suspense>
  );
}

export default Etiquetado;