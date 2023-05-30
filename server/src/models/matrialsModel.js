import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const materials = db.define('materials' ,{
    activityName:{
        type: DataTypes.STRING
    },
    activityList:{
        type: DataTypes.STRING
    }
},{
    freezeTableName: true
});

(async() => {
    await db.sync();
})();

export default materials;
