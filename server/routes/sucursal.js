const express = require('express');
const cors = require('cors');
const _ = require('underscore');

const BranchOffice = require('../models/sucursal');

let app = express();
const { verificaToken } = require('../middlewares/autenticacion');

app.use(cors({ origin: '*' }));

app.get('/branchOffice/:idEmp', verificaToken, (req, res) => {
    let id = req.params.idEmp;

    BranchOffice.find({ business: id, status: true }) //Lo que esta dentro de apostrofe son campos a mostrar
        .exec((err, branchOffice) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                branchOffice
            });
        });
});


app.get('/branchOffice/suc/:idSuc', verificaToken, (req, res) => {
    let id = req.params.idSuc;

    BranchOffice.find({ _id: id, status: true }) //Lo que esta dentro de apostrofe son campos a mostrar
        .populate('business')
        .exec((err, branchOffice) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                branchOffice
            });
        });
});
/*
    Buscar sucursal por nombre
*/
app.get('/branchOffice/search/:description', verificaToken, function(req, res) {

    let descriptionB = req.params.description;
    let regex = new RegExp(descriptionB, 'i');

    BranchOffice.find({ name: regex })
        .exec((err, branchOffice) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                branchOffice
            });
        });
});

app.post('/branchOffice', verificaToken, function(req, res) {
    let body = req.body;

    let branchOffice = new BranchOffice({
        name: body.name,
        phone: body.phone,
        address: body.address,
        canton: body.canton,
        business: body.business
    });

    branchOffice.save((err, branchOfficeDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            branchOffice: branchOfficeDB
        });
    });
});


app.put('/branchOffice/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['name', 'phone', 'address', 'canton']);

    BranchOffice.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, branchOfficeDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            branchOffice: branchOfficeDB
        });
    });
});


app.delete('/branchOffice/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    let cambiaEstado = {
        status: false
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    BranchOffice.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, branchOfficeBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!branchOfficeBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Empresa no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            branchOffice: branchOfficeBorrado
        });
    });
});


app.delete('/branchOffice/habilitar/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    let cambiaEstado = {
        status: true
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    BranchOffice.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, branchOfficeBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!branchOfficeBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Empresa no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            branchOffice: branchOfficeBorrado
        });
    });
});

module.exports = app;