const nodemailer = require('nodemailer');

module.exports = (formulario) => {
    // var transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: 'pillaga4173@gmail.com', // Cambialo por tu email
    //         pass: 'Siguencia' // Cambialo por tu password
    //     }
    // });

    let transporter = nodemailer.createTransport({
        service: 'SendPulse', // no need to set host or port etc.
        auth: {
            user: 'info@physeter,net',
            pass: 'Physeter3.0'
        }
    });

    const mailOptions = {
        from: `”Bluetrack 👻” <info@physeter.net>`,
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