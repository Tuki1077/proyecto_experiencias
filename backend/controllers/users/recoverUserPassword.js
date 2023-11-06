const getDB = require('../../bbdd/db');
const { generateRandomString } = require('../../helpers');
const sendMail = require('../../src/sendMail');

const recoverUserPassword = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { email } = req.body;

        const [user] = await connection.query(
            `SELECT id FROM users WHERE email = ?;`,
            [email]
        );

        if (user.length < 1) {
            const error = new Error(
                `El correo no corresponde con ninguna cuenta registrada`
            );
            error.httpStatus = 404;
            throw error;
        }

        const recoverCode = generateRandomString(20);

        const emailBody = `
            
            Se solicitó un cambio de contraseña para el usuario registrado con este email en la plataforma VAN Experiences.

            El código de recuperación es: http://3.87.209.149:3000/reset-pass/${recoverCode}

            Si no has sido tu por favor, ignora este email.

            ¡Gracias!
        `;

        await sendMail({
            to: email,
            subject: 'Cambio de contraseña VAN Experiences',
            body: emailBody,
        });

        await connection.query(
            `UPDATE users SET recoverCode = ? WHERE email = ?;`,
            [recoverCode, email]
        );

        res.send({
            status: 200,
            message: 'Email enviado',
            recoverCode: recoverCode,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = recoverUserPassword;
