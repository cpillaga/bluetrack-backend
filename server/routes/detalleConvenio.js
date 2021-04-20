const express = require('express');
const cors = require('cors');

const AgreementDetail = require('../models/detalleConvenio');

const app = express();

const { verificaToken } = require('../middlewares/autenticacion');

app.use(cors({ origin: '*' }));

//Este metodo busca las solcitudes para una sucursal
app.get('/agreementDetail/:idSol', function(req, res) {
    let idSol = req.params.idSol;

    AgreementDetail.find({ shippingAgreement: idSol })
        .populate({
            path: 'shippingAgreement',
            populate: {
                path: 'client'
            }
        })
        .populate({
            path: 'request',
            populate: {
                path: 'receiver',
                populate: {
                    path: 'canton'
                }
            }
        })
        .exec((err, agreementDetail) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                agreementDetail
            });
        });
});

app.post('/agreementDetail', verificaToken, function(req, res) {
    let body = req.body;

    let agreementDetail = new AgreementDetail({
        description: body.description,
        quantity: body.quantity,
        price: body.price,
        total: body.total,
        img: body.img,
        shippingAgreement: body.shippingAgreement
    });

    agreementDetail.save((err, agreementDetailDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            agreementDetail: agreementDetailDB
        });
    });
});

module.exports = app;