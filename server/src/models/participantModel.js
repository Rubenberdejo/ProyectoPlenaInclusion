import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Users from "./userModel.js";

const { DataTypes } = Sequelize;
class Participant extends Users{};
const participant = db.define('participant' ,{
    preferences:{
        type: DataTypes.STRING
    },
    mobillityIssues:{
        type: DataTypes.STRING
    }
},{
    freezeTableName: true
});

(async() => {
    await db.sync();
})();

export default participant;