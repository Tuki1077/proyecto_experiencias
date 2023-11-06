'use strict';

const getDB = require('../../bbdd/db');
const {
    validate,
    generateRandomString,
    formatDate,
    savePhoto,
} = require('../../helpers');

const { newUserSchema } = require('../../validations/newSchemaUserExperience');
const sendMail = require('../../src/sendMail');
let connection;

const newUser = async (req, res, next) => {
    try {
        connection = await getDB();
        await validate(newUserSchema, req.body);
        const { username, email, password, last, name } = req.body;

        const [user] = await connection.query(
            `SELECT id FROM users WHERE email = ? OR username = ?;`,
            [email, username]
        );

        if (user.length > 0) {
            const error = new Error(
                'Ya existe un usuario con ese email/usuario en la base de datos'
            );
            error.httpStatus = 409;
            throw error;
        }

        const registrationCode = generateRandomString(40);

        const emailBody = `
            <p>Te acabas de registrar en Van Experiences.</p>
            <span class="mainEmail">${email}</span>
            <p>Pulsa en este link para verificar tu cuenta:<p>
            <a href="http://localhost:3000/register-validate/${registrationCode}" target="_blank">Verifica tu email</a> 
        `;

        await sendMail({
            to: email,
            subject: `<h1>Activa tu cuenta en VAN Experiences</h1>`,
            body: emailBody,
        });
        if (req.files && req.files.avatar) {
            const avatarName = await savePhoto(req.files.avatar);

            await connection.query(
                `INSERT INTO users 
                ( username, pwd, email, nombre, apellidos,  registrationCode, createdAt, avatar)
                 VALUES 
                 (?, SHA2(?, 512), ?, ?, ?, ?, ?, ?);`,
                [
                    username,
                    password,
                    email,
                    name,
                    last,
                    registrationCode,
                    formatDate(new Date()),
                    avatarName,
                ]
            );
        } else {
            await connection.query(
                `INSERT INTO users 
                ( username, pwd, email, nombre, apellidos, registrationCode, createdAt)
                 VALUES 
                 (?, SHA2(?, 512), ?, ?, ?, ?, ?);`,
                [
                    username,
                    password,
                    email,
                    name,
                    last,
                    registrationCode,
                    formatDate(new Date()),
                ]
            );
        }

        res.send({
            status: 200,
            code: registrationCode,
            message: 'Usuario registrado, comprueba tu email para activarlo',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = newUser;
