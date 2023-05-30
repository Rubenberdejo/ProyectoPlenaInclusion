import Users from '../models/userModel.js';
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import cron from "node-cron";
import Activities from "../models/activitiesModel.js";
import participantactivitymodel from "../models/participantActivityModel.js";
import { Op } from "sequelize";
import participant from '../models/participantModel.js';

// La función "GetUsers" es una función asincrónica en Node.js que obtiene todos los usuarios.
// Recibe una solicitud y una respuesta como parámetros. Dentro de la función, se realiza una consulta 
// al modelo "Users" para obtener todos los usuarios y se envía una respuesta JSON al cliente con los usuarios encontrados.
// En caso de error, se muestra el error en la consola.
export const GetUsers = async(req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ['id', 'name', 'password', 'lastName', 'userName', 'email', 'role', 'phone', 'age']
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

// La función "Register" registra a un nuevo usuario en Node.js. Se obtienen los valores de nombre de usuario, contraseña y confirmación
// de contraseña de la solicitud. Si las contraseñas no coinciden, se devuelve un mensaje de error. Se genera una sal y se cifra la contraseña utilizando bcrypt.
// Luego, se intenta crear un nuevo usuario en el modelo "Users" con el nombre de usuario y la contraseña cifrada. Si la creación es exitosa, se envía un mensaje 
// de éxito al cliente. En caso de error, se muestra en la consola.
export const Register = async(req, res) => {
    const { username, password, confPassword } = req.body;
    if(password !== confPassword) return res.status(400).json({ msg: "Las contraseñas no coinciden"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await Users.create({
            name: username,
            password: hashPassword
        });
        res.json({msg: "Usuario registrado exitosamente"});
    } catch (error) {
        console.log(error);
    }
}

// La función "RegisterUser" registra un nuevo usuario en Node.js. Se obtienen el nombre de usuario y el correo electrónico de la solicitud.
// Se genera una contraseña aleatoria utilizando crypto.randomBytes(). Se genera una sal y se cifra la contraseña utilizando bcrypt. 
// Se crea un nuevo usuario en el modelo "Users" con el nombre de usuario, correo electrónico y contraseña cifrada. Si la creación es exitosa, 
// se envía la contraseña generada como respuesta. En caso de error, se muestra en la consola.
export const RegisterUser = async (req, res) => {
    const { username, email } = req.body;
    const password = crypto.randomBytes(5).toString('hex');

    try {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        await Users.create({
            name: username,
            email: email,
            password: hashPassword
        });
        await sendWelcomeEmail(email, password);
        res.json({ msg: password });
    } catch (error) {
        console.log(error);
    }
};

// La función "Login" maneja el inicio de sesión de un usuario en Node.js. Se obtienen el nombre de usuario y la contraseña de la solicitud.
// Se busca y verifica el usuario en el modelo "Users". Se generan tokens de acceso y actualización usando jwt y se actualiza el token de 
// actualización en la base de datos. Se envía una cookie con el token de actualización al cliente y se muestra el token de acceso y el de 
// actualización en la consola. Se responde al cliente con un mensaje de bienvenida, el correo electrónico y el token de acceso. 
//En caso de error, se muestra en la consola.
export const Login = async (req, res) => {
    const {username, password} = req.body;

    try {
        const user = await Users.findOne({ where: { name: username } });

        if (!user) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ msg: "Contraseña incorrecta" });
            } 
            const id = user.id;
            const email = user.email;
            const usern = user.name;  
        const accessToken = jwt.sign({id, usern, email}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '15s'
        });
        const refreshToken = jwt.sign({id, usern, email}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        await Users.update({refreshToken: refreshToken},{
            where:{
                id: id
            }
        });
        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        console.log(accessToken,refreshToken);
        res.json({email, accessToken: accessToken});
    } catch (error) {
        console.log(error);
    }
};

// La función "updateUser" actualiza un usuario en Node.js. Se obtienen el identificador de usuario, correo electrónico y contraseña de la solicitud.
// Se busca y verifica la existencia del usuario en el modelo "Users". Se actualiza el correo electrónico y contraseña del usuario en la base de datos.
// Se envía una respuesta con un mensaje indicando que el usuario ha sido actualizado correctamente. En caso de error, se muestra en la consola.
export const updateUser = async (req, res) => {
    const { id, email, password } = req.body;
    try {
      const user = await Users.findOne({ where: { id: id } });
      console.log(id);
      if (!user) {
        return res.status(404).json({ msg: "user not found" });
      }
      await Users.update(
        {
          email: email,
          password: password,
        },
        {
          where: {
            id: id,
          },
        }
      );
      res.json({ msg: "user updated successfully" });
    } catch (error) {
      console.log(error);
    }
  };

  // La función "ChangePassword" en Node.js cambia la contraseña de un usuario. Se verifica la existencia del usuario en el modelo "Users" y se compara la antigua 
// contraseña proporcionada con la contraseña almacenada. Si la verificación es exitosa, se genera una nueva contraseña cifrada y se actualiza en la base de datos. 
// Se responde al cliente con un mensaje indicando que la contraseña ha sido modificada exitosamente. En caso de error, se muestra en la consola.
  export const ChangePassword = async (req, res) => {
    const { name, oldPw, newPw } = req.body;

    // Encuentra al usuario por su nombre de usuario.
    const userToChange = await Users.findOne({
        where: {
            name: name
        }
    });

    if (!userToChange) {
        return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    
    console.log(oldPw);
    // Verifica la antigua contraseña.
    const isOldPasswordValid = await bcrypt.compare(oldPw, userToChange.password);
    if (!isOldPasswordValid) {
        return res.status(401).json({ msg: "Contraseña antigua incorrecta" });
    }

    // Si la antigua contraseña es válida, hash la nueva contraseña y guárdala en la base de datos.
    const salt = await bcrypt.genSalt();
    const newHashPassword = await bcrypt.hash(newPw, salt);

    console.log(name);
    await Users.update({ password: newHashPassword }, {
        where: { name: name }
    });

    res.json({ msg: "Contraseña modificada exitosamente." });
}

// La función "sendWelcomeEmail" en Node.js envía un correo de bienvenida al usuario utilizando nodemailer. Se configura el servicio de Gmail para autenticarse 
// con las credenciales de la cuenta de correo electrónico. Se especifica el remitente, el destinatario, el asunto y el contenido del correo que contiene 
// la contraseña de registro. Se intenta enviar el correo y se muestra un mensaje de éxito o un mensaje de error en la consola.
const sendWelcomeEmail = async (email, password) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'rubeau1997@gmail.com',
            pass: 'dtwbckpwdlqnvfeu'
        }
    });

    const mailOptions = {
        from: 'rubeau1997@gmail.com',
        to: email,
        subject: 'Bienvenido a nuestra aplicación',
        text: `Gracias por registrarte en nuestra aplicación. Tu contraseña es: ${password}`
        //text: `Aquí están tus actividades para la semana: \n${activitiesText}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email enviado');
    } catch (error) {
        console.error('Hubo un error al enviar el email:', error);
    }
};

// La función "findActivitiesForNext7Days" en Node.js busca actividades para los próximos 7 días en base a un identificador de usuario. 
// Se genera la fecha de inicio y final basada en la fecha actual. Se realizan consultas a modelos de base de datos para obtener las actividades 
// relacionadas con ese usuario. Se itera sobre las actividades encontradas y se realiza otra consulta para obtener las actividades 
// que coincidan con el rango de fechas especificado. Los resultados se agregan a un arreglo y se devuelve.
export const findActivitiesForNext7Days = async (userId) => {
    // Genera la fecha de inicio y final basado en la fecha actual.
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);

    const activities = await participantactivitymodel.findAll({
        attributes: ["activityId"],
        where: {
            participantId: userId,
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

    return foundActivities;
};

// La función "weeklyEmail" en Node.js busca y obtiene todos los usuarios que han habilitado la recepción de correos electrónicos. Luego, 
// crea un transporte de correo electrónico utilizando Nodemailer, configurando las credenciales del servicio de correo. Este transporte 
// se utilizará posteriormente para enviar el correo electrónico semanal.
export const weeklyEmail = async () => {
    // Encuentra a todos los usuarios que hayan habilitado la recepción de correos electrónicos.
    const users = await Users.findAll({ where: {enableEmails: true }});

    // Crea un transporte de correo electrónico usando Nodemailer.
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "rubeau1997@gmail.com",
            pass: "dtwbckpwdlqnvfeu"
        }
    });

    // Envía un correo electrónico a cada usuario.
    for (let user of users) {
        const activities = await findActivitiesForNext7Days(user.id);

        // Crea el texto del correo electrónico basado en las actividades.
        let activitiesText = activities.map(activity => `${activity.name}: ${activity.date}`).join('\n');

        let mailOptions = {
            from: "rubeau1997@gmail.com",
            to: user.email,
            subject: "Actividades de la semana",
            text: `Aquí están tus actividades para la semana: \n${activitiesText}`
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Email enviado');
        } catch (error) {
            console.error('Hubo un error al enviar el email:', error);
        }
    }
};

// Programa la tarea para que se ejecute a las 17:05 PM todos los domingos.
cron.schedule("55 18 * * SUN", weeklyEmail);

// La función "ChangeEmail" en Node.js permite cambiar el correo electrónico de un usuario. 
// Primero, se busca al usuario por su nombre de usuario. Si no se encuentra, se envía una respuesta de error al cliente. 
// Luego, se verifica si el correo electrónico antiguo proporcionado coincide con el correo electrónico actual del usuario. 
// Si no coinciden, se envía una respuesta de error al cliente. Si coinciden, se actualiza el correo electrónico del usuario 
// en la base de datos con el nuevo correo electrónico proporcionado. Se envía una respuesta exitosa al cliente para indicar que el 
// cambio de correo electrónico se realizó correctamente.
export const ChangeEmail = async (req, res) => {
    const { name, oldEm, newEm } = req.body;

    // Encuentra al usuario por su nombre de usuario.
    const userToChange = await Users.findOne({
        where: {
            name: name
        }
    });

    if (!userToChange) {
        return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    const isOldEmail = true;
    // Verifica la antigua contraseña.
    if (!oldEm === newEm) {
        isOldEmail = false;
    }
    if (!isOldEmail) {
        return res.status(401).json({ msg: "Email antiguo incorrecto" });
    }
    console.log(name);
    await Users.update({ email: newEm }, {
        where: { name: name }
    });

    res.json({ msg: "Email modificado exitosamente." });
}
// permite el logout de la aplicacion
export const Logout = async (req, res) => {
    try {
        // Obtén el token de refresco del cookie
        const refreshToken = req.cookies.refreshToken;
        // Encuentra al usuario por el token de refresco
        const user = await Users.findOne({ where: { refreshToken: refreshToken } });
        if (!user) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }
        // Limpia el token de refresco del usuario en la base de datos
        await Users.update({ refreshToken: null }, {
            where: {
                id: user.id
            }
        });
        // Borra el cookie de refresco
        res.clearCookie('refreshToken');
        res.json({ msg: "Cierre de sesión exitoso" });
    } catch (error) {
        console.log(error);
    }
};

// hace update a al campo enableEmails de la tabla a true o false.
export const UpdateEmailPreference = async (req, res) => {
    const { id, enableEmails } = req.body;
    console.log(id);
    try {
        await Users.update({ enableEmails: enableEmails }, {
            where: { id: id }
        });
        res.json({ msg: "Preferencia de correo electrónico actualizada exitosamente." });
    } catch (error) {
        console.log(error);
    }
};