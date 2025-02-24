import pool from '@/lib/db'; // Asegúrate de que tu pool esté configurado para MySQL

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { departamento } = req.query;
  let connection;

  try {
    // Obtiene una conexión del pool
    connection = await pool.getConnection();

    if (departamento != null) {
      // Consulta para obtener los usuarios por departamento
      const [result] = await connection.execute('SELECT * FROM usuarios WHERE departamento_id = ? AND eliminado = 0 ORDER BY nombre ASC', [departamento]);

      if (result.length > 0) {
        const users = result;
        return res.status(200).json({ success: true, users });
      } else {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
    } else {
      // Consulta para obtener los usuarios con departamentos específicos
      const [result] = await connection.execute('SELECT * FROM usuarios WHERE eliminado = 0 ORDER BY nombre ASC');

      if (result.length > 0) {
        const users = result;
        return res.status(200).json({ success: true, users });
      } else {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }
    }
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  } finally {
    // Liberar la conexión
    if (connection) connection.release();
  }
}