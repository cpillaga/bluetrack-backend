const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const SEED = require('../config/config').SEED;
const cors = require('cors');

const Client = require('../models/cliente');

const app = express();
const { verificaToken } = require('../middlewares/autenticacion');
app.use(cors({ origin: '*' }));

app.post('/client/login', function(req, res) {
    let body = req.body;

    Client.findOne({ user: body.user }, (err, clientDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar Transportista',
                errors: err
            });
        }

        if (!clientDB) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, clientDB.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas',
                errors: err
            });
        }

        //Crear un token!!

        clientDB.password = null;

        var token = jwt.sign({ client: clientDB }, SEED); //4 horas

        res.json({
            ok: true,
            client: clientDB,
            token: token,
            id: clientDB._id
        });

    });
});

app.get('/client', verificaToken, function(req, res) {
    Client.find({})
        .exec((err, client) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                client
            });
        });
});

app.get('/client/searchMail/:mail', verificaToken, function(req, res) {
    let mail = req.params.mail;

    Client.find({ email: mail })
        .exec((err, client) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                client
            });
        });
});

app.post('/client', function(req, res) {
    let body = req.body;

    let client = new Client({
        ciRuc: body.ciRuc,
        name: body.name,
        address: body.address,
        phone: body.phone,
        email: body.email,
        user: body.user,
        password: bcrypt.hashSync(body.password, 10),
        // canton: body.canton
    });

    client.save((err, clientDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        clientDB.password = null;
        res.json({
            ok: true,
            client: clientDB
        });
    });
});

app.put('/client/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['ciRuc', 'name', 'address', 'phone', 'email']);

    if (body.password != null) {
        body.password = bcrypt.hashSync(body.password, 10);
    }

    Client.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, clientDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        clientDB.password = null;

        res.json({
            ok: true,
            client: clientDB
        });
    });
});

app.put('/client/password/:idClient', verificaToken, function(req, res) {
    let idClient = req.params.idClient;
    let bodyNew = req.body;

    Client.findOne({ _id: idClient }, (err, clientDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar Cliente',
                errors: err
            });
        }

        if (!bcrypt.compareSync(bodyNew.passwordAnt, clientDB.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Contraseñas no coinciden',
                errors: err
            });
        }

        let body = _.pick(req.body, ['password']);

        if (body.password != null) {
            body.password = bcrypt.hashSync(body.password, 10);
        }

        Client.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, clientDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            clientDB.password = null;

            res.json({
                ok: true,
                client: clientDB
            });
        });

    });

});
module.exports = app;