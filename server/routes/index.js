const express = require('express');
const app = express();

app.use(require('./admin'));
app.use(require('./canton'));
app.use(require('./provincia'));
app.use(require('./empresa'));
app.use(require('./sucursal'));
app.use(require('./usuarios'));
app.use(require('./cliente'));
app.use(require('./convenio'));
app.use(require('./destinatario'));

module.exports = app;