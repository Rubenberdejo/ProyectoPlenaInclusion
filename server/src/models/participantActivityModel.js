import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Activities from "./activitiesModel.js";
import Participant from "./participantModel.js";
import Users from "./userModel.js";

const { DataTypes } = Sequelize;

const participantActivityModel = db.define('participantActivityModel', {
  date: {
    type: DataTypes.DATE,
  },
}, {
  freezeTableName: true,
});

(async () => {
  await db.sync();
})();

Participant.belongsToMany(Activities, {
  through: participantActivityModel,
  foreignKey: {
    name: 'participantId',
    allowNull: true,
  },
});
Activities.belongsToMany(Participant, {
  through: participantActivityModel,
  foreignKey: {
    name: 'activityId',
    allowNull: true,
  },
});

export default participantActivityModel;