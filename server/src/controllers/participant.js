import Participant from "../models/participantModel.js";
import bcrypt from "bcrypt";

// get all participants
export const getParticipants = async (req, res) => {
  try {
    const participants = await Participant.findAll({
      attributes: ['preferences', 'mobilityIssues']
    });
    res.json(participants);
  } catch (error) {
    console.log(error);
  }
};

// add a new participant
export const addParticipant = async (req, res) => {
  const { id } = req.body;
  try {
    await Participant.create({
      id: id
    });
    res.json({ msg: "participant created successfully" });
  } catch (error) {
    console.log(error);
  }
};

// delete a participant by ID
export const deleteParticipant = async (req, res) => {
  const { id } = req.body;
  try {
    const participantId = parseInt(id); // convert id to integer
    const participant = await Participant.findOne({ where: { id: participantId } });
    if (!participant) {
      return res.status(404).json({ msg: "participant not found" });
    }
    await participant.destroy();
    res.json({ msg: "participant deleted successfully" });
  } catch (error) {
    console.log(error);
  }
};

// update a participant by ID
export const updateParticipant = async (req, res) => {
  const { id, transportationMeans, studies } = req.body;
  try {
    const participantId = parseInt(id); // convert id to integer
    const participant = await Participant.findOne({ where: { id: participantId } });
    if (!participant) {
      return res.status(404).json({ msg: "participant not found" });
    }
    await participant.update({
      transportationMeans: transportationMeans,
      studies: studies
    });
    res.json({ msg: "participant updated successfully" });
  } catch (error) {
    console.log(error);
  }
};
