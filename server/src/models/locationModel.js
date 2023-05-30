import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Location = db.define('Location' ,{
    descriptionOfLocation:{
        type: DataTypes.STRING
    },
    Adress:{
        type: DataTypes.STRING
    }
},{
    freezeTableName: true
});

(async() => {
    await db.sync();
})();

export default Location;
