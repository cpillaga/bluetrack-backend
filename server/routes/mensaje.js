const express = require('express');
const cors = require('cors');

const Canton = require('../models/canton');

const app = express();

const { verificaToken } = require('../middlewares/autenticacion');
const configMensaje = require('../middlewares/configMensaje');

app.use(cors({ origin: '*' }));

app.post('/mensaje', verificaToken, (req, res) => {
    configMensaje(req.body);
    res.status(200).send();
});

module.exports = app;