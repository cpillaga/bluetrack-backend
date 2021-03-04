const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let businessSchema = new Schema({
    ruc: {
        type: String,
        unique: true,
        required: [true, 'El ruc es obligatorio']
    },
    businessName: {
        type: String,
        required: [true, 'La razón social es obligatoria']
    },
    agent: {
        type: String,
        required: [true, 'El representante es obligatorio']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es obligatorio']
    },
    status: {
        type: String,
        default: 'true'
    },
    registration: {
        type: Date,
        required: [true, 'El correo es obligatorio']
    }
});

businessSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Business', businessSchema);