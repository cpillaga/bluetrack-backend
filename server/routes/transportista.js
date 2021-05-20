const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const SEED = require('../config/config').SEED;
const cors = require('cors');

const Carrier = require('../models/transportista');

const app = express();
const { verificaToken } = require('../middlewares/autenticacion');
app.use(cors({ origin: '*' }));

/* 
    Método para obtener todos los transportistas de una empresa
*/
app.get('/carrier/:idSuc', verificaToken, (req, res) => {
    let id = req.params.idSuc;

    Carrier.find({ business: id }) //Lo que esta dentro de apostrofe son campos a mostrar
        .populate('business')
        .exec((err, carrier) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                carrier
            });
        });
});

/* 
    Método para obtener todos los transportistas disponibles de una empresa
*/
app.get('/carrier/disponible/:idSuc', verificaToken, (req, res) => {
    let id = req.params.idSuc;

    Carrier.find({ business: id, status: 'Disponible' }) //Lo que esta dentro de apostrofe son campos a mostrar
        .populate('business')
        .exec((err, carrier) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                carrier
            });
        });
});

app.post('/carrier/login', function(req, res) {
    let body = req.body;

    console.log(body);

    Carrier.findOne({ user: body.user }, (err, carrierDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar Usuario',
                errors: err
            });
        }

        if (!carrierDB) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas',
                errors: err
            });
        }

        if (carrierDB.status == 'Inactivo') {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, carrierDB.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas',
                errors: err
            });
        }

        //Crear un token!!

        carrierDB.password = null;

        var token = jwt.sign({ user: carrierDB }, SEED); //8 horas

        res.json({
            ok: true,
            carrier: carrierDB,
            token: token
        });

    });
});

app.post('/carrier', verificaToken, function(req, res) {
    let body = req.body;

    let carrier = new Carrier({
        name: body.name,
        email: body.email,
        user: body.user,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        phone: body.phone,
        address: body.address,
        business: body.business
    });

    carrier.save((err, carrierDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        carrierDB.password = null;

        res.json({
            ok: true,
            carrier: carrierDB
        });
    });
});

app.put('/carrier/:id', [verificaToken], function(req, res) {
    let id = req.params.id;

    let body = _.pick(req.body, ['phone', 'address', 'role', 'password']);

    if (body.password != null) {
        body.password = bcrypt.hashSync(body.password, 10);
    }

    Carrier.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, carrierDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        carrierDB.password = null;

        res.json({
            ok: true,
            carrier: carrierDB
        });
    });
});


app.delete('/carrier/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        status: 'No disponible'
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Carrier.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, carrierBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!carrierBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Empresa no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            carrier: carrierBorrado
        });
    });
});


app.delete('/carrier/darbaja/:id', verificaToken, function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        status: 'Inactivo'
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Carrier.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, carrierBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!carrierBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Empresa no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            carrier: carrierBorrado
        });
    });
});

app.delete('/carrier/habilitar/:id', verificaToken, function(req, res) {
    let id = req.params.id;
    let cambiaEstado = {
        status: 'Disponible'
    };

    //  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    Carrier.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, carrierBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!carrierBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Empresa no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            carrier: carrierBorrado
        });
    });
});

module.exports = app;