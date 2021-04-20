const express = require('express');
const cors = require('cors');

const ShippingAgreement = require('../models/envioConvenio');

const app = express();

const { verificaToken } = require('../middlewares/autenticacion');

app.use(cors({ origin: '*' }));

/* 
    Este metodo obtiene todos los envios de una sucursal
*/
app.get('/shippingAgreement/todos/:idSuc', verificaToken, function(req, res) {
    let idSuc = req.params.idSuc;

    ShippingAgreement.find({ branchOffice: idSuc })
        .populate('branchOffice')
        .populate('client')
        .populate('carrier')
        .populate({
            path: 'receiver',
            populate: {
                path: 'canton'
            }
        })
        .exec((err, shippingAgreement) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                shippingAgreement
            });
        });
});


//Este metodo busca los envios pendientes de un transportista
app.get('/shippingAgreement/transPend/:idTrans/:estado', verificaToken, function(req, res) {
    let idTrans = req.params.idTrans;
    let estado = req.params.estado;

    ShippingAgreement.find({ carrier: idTrans, status: estado })
        .populate('branchOffice')
        .populate('client')
        .populate('carrier')
        .populate({
            path: 'receiver',
            populate: {
                path: 'canton'
            }
        })
        .exec((err, shippingAgreement) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                shippingAgreement
            });
        });
});


//Este metodo busca envios entregados de un transportista
app.get('/shippingAgreement/transEnt/:idTrans', verificaToken, function(req, res) {
    let idTrans = req.params.idTrans;

    ShippingAgreement.find({ carrier: idTrans, status: 'Entregado' })
        .populate('branchOffice')
        .populate('client')
        .populate('carrier')
        .populate({
            path: 'receiver',
            populate: {
                path: 'canton'
            }
        })
        .exec((err, shippingAgreement) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                shippingAgreement
            });
        });
});

//Este metodo busca todos los envios de un cliente
// app.get('/request/transEnt/:idClient', function(req, res) {
//     let idClient = req.params.idClient;

//     ShippingAgreement.find({ client: idClient })
//         .populate('branchOffice')
//         .populate('client')
//         .populate('carrier')
//         .populate({
//             path: 'receiver',
//             populate: {
//                 path: 'canton'
//             }
//         })
//         .exec((err, shippingAgreement) => {
//             if (err) {
//                 return res.status(400).json({
//                     ok: false,
//                     err
//                 });
//             }

//             res.json({
//                 ok: true,
//                 shippingAgreement
//             });
//         });
// });

app.post('/shippingAgreement', verificaToken, function(req, res) {
    let body = req.body;

    let shippingAgreement = new ShippingAgreement({
        date: body.date,
        subtotal: body.subtotal,
        iva: body.iva,
        total: body.total,
        status: body.status,
        guide: body.guide,
        type: body.type,
        tracking: body.tracking,
        carrier: body.carrier,
        client: body.client,
        branchOffice: body.branchOffice,
        receiver: body.receiver
    });

    shippingAgreement.save((err, shippingAgreementDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            shippingAgreement: shippingAgreementDB
        });
    });
});


app.delete('/shippingAgreement/:id/:estado', verificaToken, function(req, res) {
    let id = req.params.id;
    let estado = req.params.estado;

    let cambiaEstado = {
        status: estado
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    ShippingAgreement.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, shippingAgreementBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!shippingAgreementBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Solicitud no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            shippingAgreement: shippingAgreementBorrado
        });
    });
});

module.exports = app;