const express = require('express');
const cors = require('cors');

const Canton = require('../models/canton');

const app = express();

const { verificaToken } = require('../middlewares/autenticacion');

app.use(cors({ origin: '*' }));

app.get('/canton/:idProv', function(req, res) {
    let id = req.params.idProv;

    Canton.find({ province: id })
        .exec((err, canton) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                canton
            });
        });
});

app.get('/canton/:nombreCanton', function(req, res) {
    let nombre = req.params.nombreCanton;

    Canton.find({ description: nombre })
        .exec((err, canton) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                canton
            });
        });
});

app.post('/canton', verificaToken, function(req, res) {
    let body = req.body;

    let canton = new Canton({
        description: body.descripcion,
        province: body.provincia
    });

    canton.save((err, cantonDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            canton: cantonDB
        });
    });
});

module.exports = app;