const express = require('express');
const cors = require('cors');
const _ = require('underscore');

const Receiver = require('../models/destinatario');

let app = express();
const { verificaToken } = require('../middlewares/autenticacion');

app.use(cors({ origin: '*' }));

app.get('/receiver/:idCli', verificaToken, (req, res) => {
    let id = req.params.idCli;

    Receiver.find({ client: id }) //Lo que esta dentro de apostrofe son campos a mostrar
        .exec((err, receiver) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                receiver
            });
        });
});

/*
    Buscar sucursal por nombre
*/
app.get('/receiver/search/:name', function(req, res) {

    let nameB = req.params.name;
    let regex = new RegExp(nameB, 'i');

    Receiver.find({ name: regex })
        .exec((err, receiver) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                receiver
            });
        });
});

app.post('/receiver', verificaToken, function(req, res) {
    let body = req.body;

    let receiver = new Receiver({
        ciRuc: body.ciRuc,
        name: body.name,
        address: body.address,
        phone: body.phone,
        email: body.email,
        canton: body.canton,
        client: body.client
    });

    receiver.save((err, receiverDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            receiver: receiverDB
        });
    });
});

app.put('/receiver/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['ciRuc', 'name', 'phone', 'address', 'email', 'canton']);

    Receiver.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, receiverDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            receiver: receiverDB
        });
    });
});

app.delete('/receiver/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    Receiver.findByIdAndRemove(id, (err, receiverBorrado) => {
        // BranchOffice.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, branchOfficeBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!receiverBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Empresa no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            receiver: receiverBorrado
        });
    });
});

module.exports = app;