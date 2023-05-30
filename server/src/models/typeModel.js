import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Type = db.define('Type' ,{
    typeName:{
        type: DataTypes.STRING
    }
},{
    freezeTableName: true
});

(async() => {
    await db.sync();
})();

export default Type;