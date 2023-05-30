import AdminActivity from "../models/adminActivityModel.js";
import bcrypt from "bcrypt";

// Este codigo busca y devuelve todas las actividades de los administradores almacenadas en la base de datos.
export const GetAdminActivity = async(req, res) => {
    try {
        const adminActivity = await AdminActivity.findAll({
            attributes: ['id_users', 'id_activities']
        });
        res.json(adminActivity);
    } catch (error) {
        console.log(error);
    }
}