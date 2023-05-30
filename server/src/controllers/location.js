import Location from "../models/locationModel.js";
import bcrypt from "bcrypt";

// Este codigo busca y devuelve todas las ubicaciones de lugares almacenadas en la base de datos, 
// incluyendo su descripción y dirección.
export const getLocation = async (req, res) => {
  try {
    const location = await Location.findAll({
      attributes: ['descriptionOfLocation', 'Adress']
    });
    res.json(location);
  } catch (error) {
    console.log(error);
  }
}

// Inserta una nueva ubicacion.
export const addLocation = async (req, res) => {
  const { descriptionOfLocation, Adress } = req.body;
  try {
    await Location.create({
      descriptionOfLocation: descriptionOfLocation,
      Adress: Adress
    });
    res.json({ msg: "Location created successfully" });
  } catch (error) {
    console.log(error);
  }
}

// Elimina una ubicacion.
export const deleteLocation = async (req, res) => {
  const { id } = req.body;
  try {
    const locationId = parseInt(id); // convert id to integer
    const location = await Location.findOne({ where: { id: locationId } });
    if (!location) {
      return res.status(404).json({ msg: "Location not found" });
    }
    await location.destroy();
    res.json({ msg: "Location deleted successfully" });
  } catch (error) {
    console.log(error);
  }
}

// Actualiza una ubicacion ya creada.
export const updateLocation = async (req, res) => {
  const { id, descriptionOfLocation, Adress } = req.body;
  try {
    const locationId = parseInt(id); // convert id to integer
    const location = await Location.findOne({ where: { id: locationId } });
    if (!location) {
      return res.status(404).json({ msg: "Location not found" });
    }
    await location.update({
      descriptionOfLocation: descriptionOfLocation,
      Adress: Adress
    });
    res.json({ msg: "Location updated successfully" });
  } catch (error) {
    console.log(error);
  }
};
