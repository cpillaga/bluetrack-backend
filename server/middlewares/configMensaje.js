const nodemailer = require('nodemailer');

module.exports = (formulario) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'bluetrackgpsdeveloper@gmail.com', // Cambialo por tu email
            pass: 'bluetrack2550100' // Cambialo por tu password
        }
    });

    const mailOptions = {
        from: `Bluetrack <info@bluetrackgps.com>`,
        to: 'christian_pillaga_s@hotmail.es', // Cambia esta parte por el destinatario
        // to: `${formulario.destinatario}`, // Cambia esta parte por el destinatario
        subject: formulario.asunto,
        html: `
            <a>${formulario.mensaje}</a>
        `
    };

    transporter.sendMail(mailOptions, function(err, info) {
        if (err)
            console.log(err);
        else
            console.log(info);
    });
}