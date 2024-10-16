import pool from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'ID es requerido' });
  }

  try {
    const result = await pool.query('SELECT * FROM etiquetas_form WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Etiqueta no encontrada' });
    }

    // No necesitas JSON.parse porque `datos_formulario` ya es un objeto
    const datos_formulario = result.rows[0].datos_formulario || {};
    const pdf_path = result.rows[0].pdf_path || ''; // Valor por defecto si es null o undefined // Valor por defecto si es null o undefined
    const estatus = result.rows[0].estatus || '';

// Combinar las columnas en un solo objeto
const datos = {
    ...datos_formulario,  // Desestructurar los datos del formulario
    pdf: pdf_path,  // Agregar la columna2 al objeto
    estatus: estatus
};

    console.log('Datos obtenidos:', datos); // Verifica el contenido de los datos

    res.status(200).json(datos);
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    res.status(500).json({ message: 'Error al obtener los datos' });
  }
}
