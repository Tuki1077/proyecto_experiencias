require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const app = express();
const path = require('path');

const { PORT } = process.env;

const corsOptions = {
    origin: 'http://34.67.221.67:3000',
};

// ##################
// ## MIDDLEWARES  ##
// ##################
const authUser = require('./middlewares/authUser');
const canDoAnything = require('./middlewares/canDoAnything');
const userExists = require('./middlewares/userExists');
const experienceExists = require('./middlewares/experienceExists');
// #########################################################
// ## CONTROLADORES DE USUARIOS, EXPERIENCIAS Y RESERVAS  ##
// #########################################################
const {
    deleteUser,
    editUser,
    editUserPassword,
    getUser,
    loginUser,
    newUser,
    recoverUserPassword,
    resetUserPassword,
    validateUser,
} = require('./controllers/users');

const {
    addPhotoExperience,
    deleteExperience,
    deletePhotoExperience,
    editExperience,
    getAllExperiences,
    getExperience,
    newExperience,
} = require('./controllers/experiences');

const {
    deleteBooking,
    getAllBookings,
    getBooking,
    getCommentsRatings,
    getUserBookings,
    newBooking,
    newComment,
    newRating,
    putBookingState,
    getFinalStateBooking,
} = require('./controllers/bookings');

// ###############################################
// ## MIDDLEWARES RELACIONADAS CON DEPENDENCIAS ##
// ###############################################

app.use(morgan('dev'));
app.use(express.json());
app.use(fileUpload());
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'static/')));

// ###############################
// ## ENDPOINTS DE EXPERIENCIAS ##
// ###############################

app.get('/experiences', getAllExperiences);
app.get('/experiences/:idExp', experienceExists, getExperience);
app.post('/experiences', authUser, newExperience);
app.post('/experiences/:idExp/photo', authUser, addPhotoExperience);
app.delete('/experiences/:idExp', authUser, experienceExists, deleteExperience);
app.delete(
    '/experiences/:idExp/photo/:idPhoto',
    authUser,
    experienceExists,
    deletePhotoExperience
);
app.put('/experiences/:idExp', authUser, experienceExists, editExperience);
// ###########################
// ## ENDPOINTS DE USUARIOS ##
// ###########################

app.get('/users/:idUser', authUser, userExists, getUser); // getUser
app.get('/users/validate/:registrationCode', validateUser); // validateUser
app.post('/users', newUser); // newUser
app.post('/users/login', loginUser); // loginUser
app.put('/users/:idUser', authUser, userExists, editUser); // editUser
app.put('/users/:idUser/password', authUser, userExists, editUserPassword); // editUserPassword
app.put('/users/password/recover', recoverUserPassword); // recoverUserPassword
app.put('/users/password/reset', resetUserPassword); // resetUserPassword
app.delete('/users/:idUser', authUser, userExists, deleteUser); // deleteUser

// ###########################
// ## ENDPOINTS DE RESERVAS ##
// ###########################
app.get('/bookings/state/:idExp/:dateBooking', getFinalStateBooking); //getStateParticipants
app.get('/bookings', authUser, getAllBookings); //getAllBookings
app.get('/bookings/:idBooking', authUser, getBooking); //getBooking
app.get('/bookings/comments-ratings/:idExp', getCommentsRatings);
app.get('/bookings/:idUser/bookings', authUser, getUserBookings); //getUserBookings
app.post('/bookings', authUser, newBooking); //newBooking
app.put('/bookings/:idBooking/comments', authUser, newComment); //newComment
app.put('/bookings/:idBooking/rating', authUser, newRating); //newRating
app.delete('/bookings/:idBooking', authUser, deleteBooking); //deleteBooking
app.put('/bookings/:idBooking/state', authUser, putBookingState);
// ########################
// ## ENDPOINTS DE ERROR ##
// ########################

app.use((error, req, res, next) => {
    console.log(error);
    res.status(error.httpStatus || 500).send({
        status: `ERROR: ${error.httpStatus}`,
        message: error.message,
    });
});

app.use((req, res) => {
    res.status(404).send({
        status: 'error',
        message: 'Not Found',
    });
});

app.listen(PORT, () =>
    console.log(`Server listening at http://34.67.221.67:${PORT}`)
);
