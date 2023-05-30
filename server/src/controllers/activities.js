// En este fichero creamos las funciones que podemos hacer con la tabla "actividades".
import Activities from "../models/activitiesModel.js";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import participantactivitymodel from "../models/participantActivityModel.js"

// Esta funcion obtiene las actividades de la base de datos y las envia como respuesta en
// formato JSON al cliente que realizó la solicitud.
export const GetActivities = async (req, res) => {
    try {
        const users = await Activities.findAll({
            attributes: ['name', 'date']
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

// Esta funcion se utiliza para agregar una nueva actividad a la base de datos, utilizando valores proporcionados en
// el cuerpo de la solicitud y luego enviando una respuesta al cliente indicando si la operacion fue exitosa o si 
// se produjo un error.
export const addActivity = async (req, res) => {
    const { name, date } = req.body;
    try {
        await Activities.create({
            name: name,
            date: date,
        });
        res.json({ msg: "Actividad creada exitosamente" });
    } catch (error) {
        console.log(error);
    }
}

// La función "deleteActivity" elimina una actividad específica. Se recibe una solicitud con el parámetro "id".
// Se busca la actividad por su ID en el modelo "Activities". Si no se encuentra, se devuelve un mensaje de error.
// Si se encuentra, se elimina y se envía una respuesta de éxito. En caso de error, se muestra en la consola.
export const deleteActivity = async (req, res) => {
    const { id } = req.body;
    try {
        const activityId = parseInt(id); // convert id to integer
        const activity = await Activities.findOne({ where: { id: activityId } });
        if (!activity) {
            return res.status(404).json({ msg: "Activity not found" });
        }
        await activity.destroy();
        res.json({ msg: "Activity deleted successfully" });
    } catch (error) {
        console.log(error);
    }
}

// Es una funcion en Node.js que actualiza una actividad. Recibe una solicitud y una respuesta como parametros.
// Dentro de la funcion, se obtienen los valores de "id", "name" y "date". Se busca una actividad que coincida con
// el id proporcionado y, si no se encuentra. se devuelve un mensaje de error.
export const updateActivity = async (req, res) => {
    const { id, name, date } = req.body;
    try {
      const activityId = parseInt(id); // convert id to integer
      const activity = await Activities.findOne({ where: { id: activityId } });
      if (!activity) {
        return res.status(404).json({ msg: "Activity not found" });
      }
      await activity.update({
        name: name,
        date: date,
      });
      res.json({ msg: "Activity updated successfully" });
    } catch (error) {
      console.log(error);
    }
  };

// Es una funcion en Node.js que realiza una busqueda de actividades. Recibe una solicitud y una respuesta como parametros.
  export const buscarActividades = async (req, res) => {
    try {
      const { startDate, endDate, idUser } = req.body;
      const activities = await participantactivitymodel.findAll({
        attributes: ["activityId"],
        where: {
          participantId: idUser,
        },
      });
  
      let foundActivities = [];
  
      for (let i = 0; i < activities.length; i++) {
        const activity = await Activities.findAll({
          where: {
            id: activities[i].activityId,
            date: {
              [Op.between]: [startDate, endDate],
            },
          },
        });
        foundActivities.push(...activity);
      }
      console.log("foundActivities:", foundActivities);
      res.json({ activity: foundActivities });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error al buscar actividades" });
    }
  };

  // Este codigo exporta una funcion llamada buscarActividadesNoSub, que busca actividades no suscritas por el usuario dentro de un
  // rango de fechas especifico.
  export const buscarActividadesNoSub = async (req, res) => {
    try {
      const { startDate, endDate, idUser } = req.body;
      const subscribedActivities = await participantactivitymodel.findAll({
        attributes: ["activityId"],
        where: {
          participantId: idUser,
        },
      });
  
      const subscribedActivityIds = subscribedActivities.map((activity) => activity.activityId);
  
      const notSubscribedActivities = await Activities.findAll({
        where: {
          id: {
            [Op.notIn]: subscribedActivityIds,
          },
          date: {
            [Op.between]: [startDate, endDate],
          },
        },
      });
      console.log(notSubscribedActivities);
      res.json({ activity: notSubscribedActivities });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error al buscar actividades no inscritas" });
    }
  };
  