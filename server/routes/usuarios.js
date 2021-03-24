const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const SEED = require('../config/config').SEED;
const cors = require('cors');

const User = require('../models/usuarios');

const app = express();
const { verificaToken } = require('../middlewares/autenticacion');
app.use(cors({ origin: '*' }));

app.get('/user/:idSuc', verificaToken, (req, res) => {
    let id = req.params.idSuc;

    User.find({ branchOffice: id }) //Lo que esta dentro de apostrofe son campos a mostrar
        .populate({
            path: 'branchOffice',
            populate: {
                path: 'business'
            }
        })
        .exec((err, user) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                user
            });
        });
});

app.post('/user/login', function(req, res) {
    let body = req.body;

    User.findOne({ user: body.user, status: true }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar Usuario',
                errors: err
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas',
                errors: err
            });
        }

        //Crear un token!!

        userDB.password = null;

        var token = jwt.sign({ user: userDB }, SEED); //8 horas

        res.json({
            ok: true,
            user: userDB,
            token: token
        });

    });
});

app.post('/user', verificaToken, function(req, res) {
    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        user: body.user,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        phone: body.phone,
        address: body.address,
        branchOffice: body.branchOffice
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        userDB.password = null;

        res.json({
            ok: true,
            user: userDB
        });
    });
});

app.put('/user/:id', [verificaToken], function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['phone', 'address', 'role', 'password']);

    if (body.password != null) {
        body.password = bcrypt.hashSync(body.password, 10);
    }

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        userDB.password = null;

        res.json({
            ok: true,
            user: userDB
        });
    });
});


app.delete('/user/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        status: false
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    User.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, userBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!userBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Empresa no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            user: userBorrado
        });
    });
});


app.delete('/user/habilitar/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    let cambiaEstado = {
        status: true
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    User.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, userBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!userBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Empresa no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            user: userBorrado
        });
    });
});

module.exports = app;