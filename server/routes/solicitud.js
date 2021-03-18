const express = require('express');
const cors = require('cors');

const Request = require('../models/solicitud');

const app = express();

const { verificaToken } = require('../middlewares/autenticacion');

app.use(cors({ origin: '*' }));

//Este metodo busca las solcitudes para una sucursal
app.get('/request/sucursal/:idSuc', function(req, res) {
    let idSuc = req.params.idSuc;

    Request.find({ branchOffice: idSuc })
        .populate('branchOffice')
        .populate('client')
        .populate({
            path: 'receiver',
            populate: {
                path: 'canton'
            }
        })
        .exec((err, request) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                request
            });
        });
});

app.get('/request/cliente/:idCli', function(req, res) {
    let idCli = req.params.idCli;

    Request.find({ client: idCli })
        .populate('branchOffice')
        .populate('client')
        .populate({
            path: 'receiver',
            populate: {
                path: 'canton'
            }
        })
        .exec((err, request) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                request
            });
        });
});

app.post('/request', verificaToken, function(req, res) {
    let body = req.body;

    let request = new Request({
        date: body.date,
        subtotal: body.subtotal,
        iva: body.iva,
        total: body.total,
        type: body.type,
        client: body.client,
        branchOffice: body.branchOffice,
        receiver: body.receiver
    });

    request.save((err, requestDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            request: requestDB
        });
    });
});

app.delete('/request/:id/:estado', verificaToken, function(req, res) {
    let id = req.params.id;
    let estado = req.params.estado;

    let cambiaEstado = {
        status: estado
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Request.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, requestBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!requestBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Solicitud no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            request: requestBorrado
        });
    });
});

module.exports = app;