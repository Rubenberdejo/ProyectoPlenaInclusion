import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Users from "./userModel.js";

const { DataTypes } = Sequelize;
class Admin extends Users{}

const admin = db.define('admin' ,{
    transportationMeans:{
        type: DataTypes.STRING
    },
    studies:{
        type: DataTypes.STRING
    }
},{
    freezeTableName: true
});

(async() => {
    await db.sync();
})();

export default admin;