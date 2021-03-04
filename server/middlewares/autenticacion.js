const jwt = require('jsonwebtoken');

const SEED = require('../config/config').SEED;

// ================================
//  Verificar Token
// ================================}
let verificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'Token  no válido',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();
    });
};

module.exports = {
    verificaToken
};