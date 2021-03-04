// detailAgreement

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let agreeDetailSchema = new Schema({
    quantity: {
        type: Number,
        required: [true, 'La cantidad es obligatorio']
    },
    total: {
        type: Number,
        required: [true, 'El total es obligatorio']
    },
    agreement: {
        type: Schema.Types.ObjectId,
        ref: 'Agreement',
        required: [true, 'El código de convenio es obligatorio']
    },
    shippingAgreement: {
        type: Schema.Types.ObjectId,
        ref: 'ShippingAgreement',
        required: [true, 'El envío convenio es obligatorio']
    },
    carrier: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El destinatario es obligatorio']
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'Receiver',
        required: [true, 'El destinatario es obligatorio']
    }
});

agreeDetailSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('AgreementDetail', agreeDetailSchema);