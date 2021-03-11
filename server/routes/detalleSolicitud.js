const express = require('express');
const cors = require('cors');

const RequestDetail = require('../models/solicitud');

const app = express();

const { verificaToken } = require('../middlewares/autenticacion');

app.use(cors({ origin: '*' }));

//Este metodo busca las solcitudes para una sucursal
app.get('/requestDetail/:idSol', function(req, res) {
    let idSol = req.params.idSol;

    RequestDetail.find({ request: idSol })
        .populate('request')
        .exec((err, requestDetail) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                requestDetail
            });
        });
});

app.post('/requestDetail', verificaToken, function(req, res) {
    let body = req.body;

    let requestDetail = new RequestDetail({
        description: body.description,
        quantity: body.quantity,
        price: body.price,
        total: body.total,
        img: body.img,
        request: body.request
    });

    requestDetail.save((err, requestDetailDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            requestDetail: requestDetailDB
        });
    });
});

module.exports = app;