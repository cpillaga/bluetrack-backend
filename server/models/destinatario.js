const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let receiverSchema = new Schema({
    ciRuc: {
        type: String,
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
        required: [true, 'El correo es obligatorio']
    },
    canton: {
        type: Schema.Types.ObjectId,
        ref: 'Canton',
        required: [true, 'El cantón es obligatorio']
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: [true, 'El cliente es obligatorio']
    }
});

receiverSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Receiver', receiverSchema);