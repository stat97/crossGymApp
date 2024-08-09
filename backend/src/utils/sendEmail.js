const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");
const { setTestEmailSend } = require("../state/state.data");

const sendEmail = (userEmail, name, confirmationCode) => {
  setTestEmailSend(false);
  const email = process.env.EMAIL;
  const password = process.env.PASSWORD;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email,
      pass: password,
    },
  });

  const mailOptions = {
    from: email,
    to: userEmail,
    subject: "Asunto: Código de Confirmación - ¡Bienvenido a CrossGymApp!",
    html: `Estimado/a ${name},

    ¡Gracias por confiar en CrossGymApp! Nos alegra mucho tenerte como parte de nuestra comunidad fitness.

    Tu código de confirmación es: ${confirmationCode}

    Por favor, ingrésalo en la plataforma para completar tu registro. Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos. Estamos aquí para ayudarte a alcanzar tus metas.

    ¡Bienvenido/a a CrossGymApp!

    Saludos cordiales, , gracias por confiar en nosotros 
    Equipo de CrossGymApp`,
  };

  console.log("Contenido del correo:", mailOptions.html);

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Error al enviar el email:", error);
      setTestEmailSend(false);
      return;
    }
    console.log("Email enviado: " + info.response);
    console.log("Contenido del correo:", mailOptions.html);
    setTestEmailSend(true);
  });
};

module.exports = sendEmail;

