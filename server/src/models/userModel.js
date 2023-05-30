import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Users = db.define('users' ,{
    id_user:{
        type: DataTypes.STRING
    },
    name:{
        type: DataTypes.STRING
    },
    password:{
        type: DataTypes.STRING
    },
    lastName:{
        type: DataTypes.STRING
    },
    UserName:{
        type: DataTypes.STRING
    },
    email:{
        type: DataTypes.STRING
    },
    role:{
        type: DataTypes.STRING
    },
    phone:{
        type: DataTypes.STRING
    },
    age:{
        type: DataTypes.STRING
    },
    accessToken:{
        type: DataTypes.STRING
    },
    refreshToken:{
        type: DataTypes.STRING
    },
    enableEmails:{
        type: DataTypes.BOOLEAN
    }
},{
    freezeTableName: true
});

(async() => {
    await db.sync();
})();

export default Users;
