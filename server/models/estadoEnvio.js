const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let statusSchema = new Schema({
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    date: {
        type: Date,
        required: [true, 'El nombre es obligatorio']
    },
    shippingAgreement: {
        type: Schema.Types.ObjectId,
        ref: 'ShippingAgreement',
        required: true
    }
});

statusSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Status', statusSchema);