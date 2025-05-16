const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("aionnet_pruebas", "aionnet", "Rrio1003", {
  host: "50.6.199.166", // Cambia esto según tu servidor
  dialect: "mysql", // Cambia a "mysql", "sqlite" o "mssql" según tu BD
  dialectModule: require("mysql2"),
});

// bases de datos
// "aionnet_pruebas", "aionnet", "Rrio1003","50.6.199.166"

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión establecida correctamente.");
  } catch (error) {
    console.error("Error de conexión:", error);
  }
})();

module.exports = sequelize;
