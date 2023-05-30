import ParticipantActivity from "../models/participantActivityModel.js";
import bcrypt from "bcrypt";
import { addParticipant } from "./participant.js";
import Users from "../models/userModel.js";

export const GetParticipantActivity = async(req, res) => {
    try {
        const participantActivity = await ParticipantActivity.findAll({
            attributes: ['id_users', 'id_activities']
        });
        res.json(participantActivity);
    } catch (error) {
        console.log(error);
    }
}

export const toggleParticipantActivity = async (req, res) => {
  try {
    const { participantId, activityId } = req.body;
    
    // Buscar la relación existente en ParticipantActivity
    const existingEntry = await ParticipantActivity.findOne({ where: { participantId, activityId } });
    
    if (existingEntry) {
      // Si la entrada ya existe, la eliminamos (cancelar inscripción)
      await ParticipantActivity.destroy({ where: { participantId, activityId } });
      res.json({ message: "Se ha cancelado la inscripción a la actividad." });
    } else {
      // Si la entrada no existe, la creamos (inscribirse)
      const newParticipantActivity = await ParticipantActivity.create({ participantId, activityId });
      res.json({ newParticipantActivity, message: "Se ha inscrito en la actividad." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error al modificar la inscripción en la actividad" });
  }
};

// Añade un participante a una actividad.
export const addParticipantActivity = async (req, res) => {
    try {
      const user = await Users.findOne({ where: { name: username } });
      addParticipant(user.id);
      const { participantId, activityId } = req.body;
      const newParticipantActivity = await ParticipantActivity.create({
        participantId: id,
        activityId,
      });
      res.json({newParticipantActivity});
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error al crear la relación" });
    }
  };