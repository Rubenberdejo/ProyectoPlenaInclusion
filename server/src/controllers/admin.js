import Admin from "../models/adminModel.js";
import bcrypt from "bcrypt";

// Este codigo exporta una funcion que busca registros de administradores en la base de datos y
// devuelve los campos especificados en un formato JSON como respuesta de una solicitud web.
export const GetAdmin = async (req, res) => {
    try {
        const admin = await Admin.findAll({
            attributes: ['name', 'password', 'transportationMeans','studies']
        });
        res.json(admin);
    } catch (error) {
        console.log(error);
    }
}

// Este codigo se encarga de crear un nuevo administrador en la base de datos, utilizando los datos
// proporcionados en la solicitud HTTP. Si la creacion es exitosa, se envia una respuesta JSON con
// un mensaje de exito, en caso de error se muestra el error en consola pero no se envía una respuesta
// al cliente en este caso.
export const addAdmin = async (req, res) => {
    const { transportationMeans, studies } = req.body;
    try {
        await Admin.create({
            transportationMeans: transportationMeans,
            studies: studies
        });
        res.json({ msg: "admin creado exitosamente" });
    } catch (error) {
        console.log(error);
    }
}

// Este codigo busca un administrador por su ID en la base de datos y lo elimina si existe, devolviendo una respuesta exitosa. 
// Si no se encuentra el administrador, se devuelve una respuesta de error.
export const deleteAdmin = async (req, res) => {
    const { id } = req.body;
    try {
        const adminId = parseInt(id); // convert id to integer
        const admin = await Admin.findOne({ where: { id: adminId } });
        if (!admin) {
            return res.status(404).json({ msg: "admin not found" });
        }
        await admin.destroy();
        res.json({ msg: "admin deleted successfully" });
    } catch (error) {
        console.log(error);
    }
}

// Este codigo busca un administrador por su ID en la base de datos y actualiza sus datos con los valores proporcionados
// en la solicitud, devolviendo una respuesta exitosa. Si no se encuentra el administrador, se devuelve una respuesta de error.
export const updateAdmin = async (req, res) => {
    const { id, transportationMeans, studies} = req.body;
    try {
      const adminId = parseInt(id); // convert id to integer
      const admin = await Admin.findOne({ where: { id: adminId } });
      if (!admin) {
        return res.status(404).json({ msg: "admin not found" });
      }
      await admin.update({
        transportationMeans: transportationMeans,
        studies: studies
      });
      res.json({ msg: "admin updated successfully" });
    } catch (error) {
      console.log(error);
    }
  };
