// Rutas a cada una de las funciones del server.
// Las que tienen verify token son las que van protegidas.
import Express from 'express';
import { refreshToken } from '../middleware/RefreshToken.js';
import { verifyToken } from '../middleware/VerifyToken.js';
import { GetUsers, Register, Login, RegisterUser, updateUser, ChangePassword, ChangeEmail, Logout, UpdateEmailPreference } from '../controllers/users.js';
import { GetActivities, addActivity, deleteActivity, updateActivity, buscarActividades, buscarActividadesNoSub } from '../controllers/activities.js';
import { GetUsersAtctivities } from '../controllers/usersActivities.js';
import { GetAdmin, addAdmin, deleteAdmin, updateAdmin } from '../controllers/admin.js';
import { GetAdminActivity } from '../controllers/adminActivity.js';
import { getLocation, updateLocation,deleteLocation,addLocation } from '../controllers/location.js';
import { getMaterials,addMaterials,deleteMaterials,updateMaterials } from '../controllers/materials.js';
import { getParticipants,addParticipant,deleteParticipant,updateParticipant } from '../controllers/participant.js';
import { GetParticipantActivity, addParticipantActivity, toggleParticipantActivity } from '../controllers/participantActivity.js';
import { getTypes,deleteType,updateType,addType } from '../controllers/type.js';

const router = Express.Router();

router.get('/', (req, res) => {
    res.render('pages/index');
});

router.get('/token', refreshToken);
router.post('/getUsers', GetUsers);
router.post('/register', Register);
router.post('/getActivities', GetActivities);
router.post('/addActivity', addActivity);
router.post('/deleteActivity', deleteActivity);
router.post('/updateActivity', updateActivity);
router.post('/registerUser', RegisterUser);
router.post('/login', Login);
router.post('/addParticipantActivity', addParticipantActivity);
router.post('/buscarActividades', buscarActividades);
router.post('/buscarActividadesNoSub', buscarActividadesNoSub);
router.post('/updateUser', updateUser);
router.post('/CambioContra',verifyToken, ChangePassword);
router.post('/CambioEmail',verifyToken, ChangeEmail);
router.post('/logout', Logout);
router.post('/updateEmailPreference', UpdateEmailPreference);
router.post('/toggle-participant-activity', toggleParticipantActivity);



export default router;