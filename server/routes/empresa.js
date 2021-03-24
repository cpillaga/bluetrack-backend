const express = require('express');
const cors = require('cors');
const _ = require('underscore');

const Business = require('../models/empresa');

let app = express();
const { verificaToken } = require('../middlewares/autenticacion');

app.use(cors({ origin: '*' }));

app.get('/business', verificaToken, (req, res) => {
    // console.log("Entro al metodo");
    Business.find() //Lo que esta dentro de apostrofe son campos a mostrar
        .exec((err, business) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                business
            });
        });
});

/*
    Buscar empresa por razonSocial
*/
app.get('/business/search/:description', verificaToken, function(req, res) {

    let descriptionB = req.params.description;
    let regex = new RegExp(descriptionB, 'i');

    Business.find({ businessName: regex })
        .exec((err, business) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                business
            });
        });
});

app.post('/business', verificaToken, function(req, res) {
    let body = req.body;

    let business = new Business({
        ruc: body.ruc,
        businessName: body.businessName,
        agent: body.agent,
        email: body.email,
        registration: body.registration
    });

    business.save((err, businessDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            business: businessDB
        });
    });
});


app.put('/business/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['ruc', 'businessName', 'agent', 'email']);


    Business.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, businessDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            business: businessDB
        });
    });
});


app.delete('/business/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    let cambiaEstado = {
        status: false
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Business.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, businessBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!businessBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Empresa no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            business: businessBorrado
        });
    });
});


app.delete('/business/habilitar/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    let cambiaEstado = {
        status: true
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Business.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, businessBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!businessBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Empresa no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            business: businessBorrado
        });
    });
});

module.exports = app;