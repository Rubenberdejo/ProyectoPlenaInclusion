import AdminActivity from "../models/adminActivityModel.js";
import bcrypt from "bcrypt";

// Busca y devuelve todas las actividades de los usuarios almacenadas en la base de datos, 
// incluyendo los identificadores de usuarios y actividades relacionados.
export const GetUsersAtctivities = async(req, res) => {
    try {
        const adminActivity = await AdminActivity.findAll({
            attributes: ['id_users', 'id_activities']
        });
        res.json(adminActivity);
    } catch (error) {
        console.log(error);
    }
}
