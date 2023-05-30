import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Admin from "./adminModel.js";
import Activities from "./activitiesModel.js";

const { DataTypes } = Sequelize;

const usersActivities = db.define('usersActivities', {}, {
  freezeTableName: true,
});

(async () => {
  await db.sync();
})();

Admin.belongsToMany(Activities, {
  through: usersActivities,
  foreignKey: {
    name: 'adminId',
    allowNull: true,
  },
});
Activities.belongsToMany(Admin, {
  through: usersActivities,
  foreignKey: {
    name: 'activityId',
    allowNull: true,
  },
});

export default usersActivities;