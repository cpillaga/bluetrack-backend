const express = require('express');
const app = express();

app.use(require('./admin'));
app.use(require('./canton'));
app.use(require('./provincia'));
app.use(require('./empresa'));
app.use(require('./sucursal'));
app.use(require('./operador'));
app.use(require('./transportista'));
app.use(require('./cliente'));
app.use(require('./convenio'));
app.use(require('./destinatario'));
app.use(require('./solicitud'));
app.use(require('./detalleSolicitud'));
app.use(require('./envioConvenio'));
app.use(require('./detalleConvenio'));
app.use(require('./estadoEnvio'));
app.use(require('./mensaje'));

module.exports = app;