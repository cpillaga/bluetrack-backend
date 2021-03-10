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
        .populate('receiver')
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
        .populate('receiver')
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
        description: body.descripcion,
        province: body.provincia
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

module.exports = app;