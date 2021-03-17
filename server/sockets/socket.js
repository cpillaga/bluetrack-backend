const { io } = require('../server');

var socketMap = [];

io.on('connection', (client) => {

    client.on('disconnect', () => {
        console.log('Usuario desconectado');
    });

    client.on('login', (data, callback) => {
        console.log(data);
        client.join(data.sala);
    });

    client.on('getSolicitud', (data, callback) => {
        console.log('recibi solicitud: ', data);

        console.log("envio data: " + data);
        let envio = "Nueva Solicitud";

        client.in(data).emit('sendSolicitud', envio);
        // client.broadcast.emit(data, envio);
        // client.broadcast.emit('sendSolicitud', envio);
    });
});