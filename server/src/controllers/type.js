import Type from "../models/typeModel.js";
import bcrypt from "bcrypt";

// Muestra el tipo de la actividad.
export const getTypes = async (req, res) => {
  try {
    const types = await Type.findAll();
    res.json(types);
  } catch (error) {
    console.log(error);
  }
};

// Añade un tipo a una actividad.
export const addType = async (req, res) => {
  const { typeName } = req.body;
  try {
    await Type.create({
      typeName: typeName
    });
    res.json({ msg: "Type created successfully" });
  } catch (error) {
    console.log(error);
  }
};

// Elimina un tipo a una actividad.
export const deleteType = async (req, res) => {
  const { id } = req.body;
  try {
    const typeId = parseInt(id); // convert id to integer
    const type = await Type.findOne({ where: { id: typeId } });
    if (!type) {
      return res.status(404).json({ msg: "Type not found" });
    }
    await type.destroy();
    res.json({ msg: "Type deleted successfully" });
  } catch (error) {
    console.log(error);
  }
};

// Actualiza el tipo de una actividad.
export const updateType = async (req, res) => {
  const { id, typeName } = req.body;
  try {
    const typeId = parseInt(id); // convert id to integer
    const type = await Type.findOne({ where: { id: typeId } });
    if (!type) {
      return res.status(404).json({ msg: "Type not found" });
    }
    await type.update({
      typeName: typeName
    });
    res.json({ msg: "Type updated successfully" });
  } catch (error) {
    console.log(error);
  }
};
