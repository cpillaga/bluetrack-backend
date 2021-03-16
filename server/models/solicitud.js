const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let requestSchema = new Schema({
    date: {
        type: Date,
        required: [true, 'La fecha es obligatoria']
    },
    subtotal: {
        type: Number,
        required: [true, 'El subtotal es obligatorio']
    },
    iva: {
        type: Number,
        required: [true, 'El iva es obligatorio']
    },
    total: {
        type: Number,
        required: [true, 'El total es obligatorio']
    },
    status: {
        type: String,
        default: 'Pendiente',
    },
    comment: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        required: [true, 'El tipo es obligatorio']
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: [true, 'El cliente es obligatorio']
    },
    branchOffice: {
        type: Schema.Types.ObjectId,
        ref: 'BranchOffice',
        required: [true, 'La sucursal es obligatorio']
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'Receiver',
        required: [true, 'El destinatario es obligatorio']
    }
});

requestSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Request', requestSchema);