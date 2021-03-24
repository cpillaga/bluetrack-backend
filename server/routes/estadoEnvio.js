const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
const SEED = require('../config/config').SEED;
const cors = require('cors');

const Status = require('../models/estado');

const app = express();
const { verificaToken } = require('../middlewares/autenticacion');
app.use(cors({ origin: '*' }));

app.get('/status', verificaToken, function(req, res) {
    Status.find({})
        .populate('shippingAgreement')
        .exec((err, status) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                status
            });
        });
});

/*
    Ver estados de envío
*/
app.get('/status/search/:id', verificaToken, function(req, res) {

    let id = req.params.id;

    Status.find({ shippingAgreement: id })
        .populate('shippingAgreement')
        .sort({ date: -1 })
        .exec((err, statusDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Status.findOne({ shippingAgreement: id })
                .populate('shippingAgreement')
                .sort({ date: -1 })
                .exec((err, actual) => {
                    res.json({
                        ok: true,
                        statusDB,
                        actual
                    });
                });
        });
});

app.post('/status', verificaToken, function(req, res) {
    let body = req.body;

    let status = new Status({
        description: body.description,
        date: body.date,
        shippingAgreement: body.shippingAgreement
    });

    status.save((err, statusDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            status: statusDB
        });
    });
});

app.put('/status/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['description']);

    Status.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, statusDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            status: statusDB
        });
    });
});

module.exports = app;