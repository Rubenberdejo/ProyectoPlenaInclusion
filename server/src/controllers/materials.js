import Materials from "../models/matrialsModel.js";
import bcrypt from "bcrypt";

// este código busca y devuelve todos los materiales de una actividad almacenados en la base de datos, 
// incluyendo el nombre de la actividad y la lista de materiales asociados a ella.
export const getMaterials = async (req, res) => {
  try {
    const materials = await Materials.findAll({
      attributes: ["activityName", "activityList"],
    });
    res.json(materials);
  } catch (error) {
    console.log(error);
  }
};

// Añade un material.
export const addMaterials = async (req, res) => {
  const { activityName, activityList } = req.body;
  try {
    await Materials.create({
      activityName: activityName,
      activityList: activityList,
    });
    res.json({ msg: "materials created successfully" });
  } catch (error) {
    console.log(error);
  }
};

// ELimina un material.
export const deleteMaterials = async (req, res) => {
  const { id } = req.body;
  try {
    const materialId = parseInt(id); // convert id to integer
    const material = await Materials.findOne({ where: { id: materialId } });
    if (!material) {
      return res.status(404).json({ msg: "material not found" });
    }
    await material.destroy();
    res.json({ msg: "material deleted successfully" });
  } catch (error) {
    console.log(error);
  }
};

// Actualiza un material de la lista.
export const updateMaterials = async (req, res) => {
  const { id, activityName, activityList } = req.body;
  try {
    const materialId = parseInt(id); // convert id to integer
    const material = await Materials.findOne({ where: { id: materialId } });
    if (!material) {
      return res.status(404).json({ msg: "material not found" });
    }
    await material.update({
      activityName: activityName,
      activityList: activityList,
    });
    res.json({ msg: "material updated successfully" });
  } catch (error) {
    console.log(error);
  }
};
