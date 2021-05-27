const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let clientSchema = new Schema({
    ciRuc: {
        type: String,
        unique: true,
        required: [true, 'El ruc o cédula es obligatorio']
    },
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    address: {
        type: String,
        required: [true, 'El direccion es obligatorio']
    },
    phone: {
        type: String,
        required: [true, 'La teléfono es obligatorio']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es obligatorio']
    },
    user: {
        type: String,
        unique: true,
        required: [true, 'El usuario es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    }
});

clientSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Client', clientSchema);