import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const adminActivityModel = db.define('adminActivityModel' ,{
    id_users:{
        type: DataTypes.STRING
    },
    id_activities:{
        type: DataTypes.STRING
    }
},{
    freezeTableName: true
});

(async() => {
    await db.sync();
})();

export default adminActivityModel;