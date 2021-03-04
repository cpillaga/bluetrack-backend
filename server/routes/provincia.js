const express = require('express');
const cors = require('cors');

const Province = require('../models/provincia');

const app = express();

const { verificaToken } = require('../middlewares/autenticacion');

app.use(cors({ origin: '*' }));

app.get('/province', function(req, res) {
    Province.find({})
        .sort('descripcion')
        .exec((err, province) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                province
            });
        });
});

app.get('/province/:description', function(req, res) {
    let description = req.params.description;

    Province.find({ descripcion: description })
        .exec((err, province) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                province
            });
        });
});

app.post('/province', verificaToken, function(req, res) {
    let body = req.body;

    let province = new Province({
        descripcion: body.descripcion,
    });

    province.save((err, provinceDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            province: provinceDB
        });
    });
});

module.exports = app;