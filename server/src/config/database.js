// Hacemos la conexion con la base de datos a traves de sequelize.
import { Sequelize } from "sequelize";
// Aqui añadimos el nombre de la base de datos, el usuario "root" y la contraseña.
const db = new Sequelize('plenainclusion2', 'root', 'Gasofinos2012?', {
    host: "localhost",
    port: 3306,
    dialect: "mysql",
});

export default db;