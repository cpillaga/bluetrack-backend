const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let shippAgreementSchema = new Schema({
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
    descuento: {
        type: Number,
        required: [true, 'El descuento es obligatorio']
    },
    ice: {
        type: Number,
        required: [true, 'El ice es obligatorio']
    },
    total: {
        type: Number,
        required: [true, 'El total es obligatorio']
    },
    status: {
        type: String,
        default: 'Pendiente',
    },
    guide: {
        type: String,
        required: [true, 'El número de guia es obligatorio']
    },
    type: {
        type: String,
        required: [true, 'El tipo es obligatorio']
    },
    tracking: {
        type: String,
        unique: true,
        required: [true, 'El número de rastreo es obligatorio']
    },
    carrier: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El destinatario es obligatorio']
    },
    branchOffice: {
        type: Schema.Types.ObjectId,
        ref: 'BranchOffice',
        required: [true, 'La sucursal es obligatorio']
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client',
        required: [true, 'El cliente es obligatorio']
    }
});

shippAgreementSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('ShippingAgreement', shippAgreementSchema);