const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const SEED = require('../config/config').SEED;
const cors = require('cors');

const Operator = require('../models/operador');

const app = express();
const { verificaToken } = require('../middlewares/autenticacion');
app.use(cors({ origin: '*' }));

app.get('/operator/:idSuc', verificaToken, (req, res) => {
    let id = req.params.idSuc;

    Operator.find({ branchOffice: id }) //Lo que esta dentro de apostrofe son campos a mostrar
        .populate({
            path: 'branchOffice',
            populate: {
                path: 'business'
            }
        })
        .exec((err, operator) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                operator
            });
        });
});

app.post('/operator/login', function(req, res) {
    let body = req.body;

    Operator.findOne({ user: body.user, status: true }, (err, operatorDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar Usuario',
                errors: err
            });
        }

        if (!operatorDB) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, operatorDB.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas',
                errors: err
            });
        }

        //Crear un token!!

        operatorDB.password = null;

        var token = jwt.sign({ user: operatorDB }, SEED); //8 horas

        res.json({
            ok: true,
            operator: operatorDB,
            token: token
        });

    });
});

app.post('/operator', verificaToken, function(req, res) {
    let body = req.body;

    let operator = new Operator({
        name: body.name,
        email: body.email,
        user: body.user,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        phone: body.phone,
        address: body.address,
        branchOffice: body.branchOffice
    });

    operator.save((err, operatorDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        operatorDB.password = null;

        res.json({
            ok: true,
            operator: operatorDB
        });
    });
});

app.put('/operator/:id', [verificaToken], function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['phone', 'address', 'role', 'password']);

    if (body.password != null) {
        body.password = bcrypt.hashSync(body.password, 10);
    }

    Operator.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, operatorDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        operatorDB.password = null;

        res.json({
            ok: true,
            operator: operatorDB
        });
    });
});


app.delete('/operator/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        status: false
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Operator.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, operatorBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!operatorBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Empresa no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            operator: operatorBorrado
        });
    });
});


app.delete('/operator/habilitar/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    let cambiaEstado = {
        status: true
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Operator.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, operatorBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!operatorBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Empresa no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            operator: operatorBorrado
        });
    });
});

module.exports = app;