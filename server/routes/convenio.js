const express = require('express');
const cors = require('cors');
const _ = require('underscore');

const Agreement = require('../models/convenio');

let app = express();
const { verificaToken } = require('../middlewares/autenticacion');

app.use(cors({ origin: '*' }));

app.get('/agreement/:idSuc', verificaToken, (req, res) => {
    let id = req.params.idSuc;

    Agreement.find({ branchOffice: id }) //Lo que esta dentro de apostrofe son campos a mostrar
        .populate('canton')
        .populate('client')
        .populate('branchOffice')
        .exec((err, agreement) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                agreement
            });
        });
});

app.post('/agreement', verificaToken, function(req, res) {
    let body = req.body;

    let agreement = new Agreement({
        description: body.description,
        price: body.price,
        cantonOrigen: body.cantonOrigen,
        cantonDestino: body.cantonDestino,
        img: body.img,
        branchOffice: body.branchOffice,
        client: body.client
    });

    agreement.save((err, agreementDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            agreement: agreementDB
        });
    });
});

app.put('/agreement/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['name', 'phone', 'address', 'canton']);

    agreement.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, agreementDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            agreement: agreementDB
        });
    });
});


app.delete('/agreement/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    Agreement.findByIdAndRemove(id, (err, agreementBorrado) => {
        // BranchOffice.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, branchOfficeBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!agreementBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Empresa no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            agreement: agreementBorrado
        });
    });
});

module.exports = app;