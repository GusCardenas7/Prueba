import pool from "@/lib/db"; // Ajusta esto a tu configuración de conexión a la base de datos

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "ID es requerido" });
    }

    let connection;

    try {
      // Obtener la conexión
      connection = await pool.getConnection();

      // Consulta parametrizada para MySQL
      const [result] = await connection.execute(
        "UPDATE vacantes SET eliminado = 1 WHERE id = ?",
        [id]
      );

      if (result.affectedRows > 0) {
        return res.status(200).json({ message: "Formulario eliminado correctamente" });
      } else {
        return res.status(404).json({ message: "Formulario no encontrado" });
      }
    } catch (error) {
      console.error("Error eliminando el formulario:", error);
      return res.status(500).json({ message: "Error al eliminar el formulario" });
    } finally {
      // Liberar la conexión
      if (connection) connection.release();
    }
  } else {
    return res.status(405).json({ message: "Método no permitido" });
  }
}