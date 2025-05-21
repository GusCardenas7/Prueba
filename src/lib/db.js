const mysql = require('mysql2/promise');

// Crear un pool de conexiones
const pool = mysql.createPool({
  host: '50.6.199.166', // Dirección del host
  user: 'aionnet',      // Usuario de la base de datos
  password: 'Rrio1003', // Contraseña
  database: 'aionnet_pruebas', // Nombre de la base de datos
  port: 3306,           // Puerto para MySQL
  waitForConnections: true,
  connectionLimit: 140,  // Número máximo de conexiones en el pool
  queueLimit: 0         // Sin límite en la cola de conexiones
});

// Exportar el pool
module.exports = pool;
