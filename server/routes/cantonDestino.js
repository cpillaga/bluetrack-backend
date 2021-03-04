const express = require('express');
const cors = require('cors');

const DestCanton = require('../models/cantonDestino');

const app = express();

app.use(cors({ origin: '*' }));

app.get('/destCanton/:idSuc', function(req, res) {
    let id = req.params.idSuc;

    DestCanton.find({ branchOffice: id })
        .populate({
            path: 'canton',
            populate: {
                path: 'province'
            }
        })
        .populate('branchOffice')
        .exec((err, destCanton) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                destCanton
            });
        });
});

app.post('/destCanton', function(req, res) {
    let body = req.body;

    let destCanton = new DestCanton({
        status: body.status,
        startingPrice: body.startingPrice,
        additionalPrice: body.additionalPrice,
        canton: body.canton,
        branchOffice: body.branchOffice
    });

    destCanton.save((err, destCantonDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            destCanton: destCantonDB
        });
    });
});


app.put('/destCanton/:id', [verificaToken], function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['status', 'startingPrice', 'additionalPrice']);

    Admin.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, adminDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        adminDB.password = null;

        res.json({
            ok: true,
            admin: adminDB
        });
    });
});


module.exports = app;