import pool from '@/lib/db'; // Asegúrate de que tu pool esté configurado para MySQL

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { id } = req.query;
  let connection;

  try {
    // Obtiene una conexión del pool
    connection = await pool.getConnection();

    const query = `
      SELECT 
          f.*, 
          u.*, 
          f.id AS id_papeleta, 
          d.nombre AS nombre_departamento,
          CONVERT_TZ(f.fecha_subida, '+00:00', '+06:00') AS fecha_subida, 
          CONVERT_TZ(f.fecha_actualizacion, '+00:00', '+06:00') AS fecha_actualizacion
      FROM 
          formularios_faltas f
      JOIN 
          usuarios u
      ON 
          f.id_usuario = u.id 
      JOIN 
          departamentos d
      ON 
          u.departamento_id = d.id
      WHERE 
          f.id_usuario = ? 
          AND (f.tipo = 'Aumento sueldo' OR f.tipo = 'Horas extras' OR f.tipo = 'Bonos / Comisiones' OR f.tipo = 'Faltas' OR f.tipo = 'Suspension') 
          AND f.eliminado = 0
      ORDER BY 
          f.fecha_actualizacion DESC;
    `;
    
    const [result] = await connection.execute(query, [id]);
    const eventos = result;

    // Retorna los eventos en formato JSON
    res.status(200).json(eventos);
  } catch (error) {
    console.error('Error al obtener los eventos:', error);
    res.status(500).json({ message: 'Error al obtener los eventos' });
  } finally {
    // Liberar la conexión
    if (connection) connection.release();
  }
}