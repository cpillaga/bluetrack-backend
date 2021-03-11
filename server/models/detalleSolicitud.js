const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let requestDetailSchema = new Schema({
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    quantity: {
        type: String,
        required: [true, 'La cantidad es obligatoria']
    },
    price: {
        type: Number,
        required: [true, 'El precio es obligatorio']
    },
    total: {
        type: Number,
        required: [true, 'El total es obligatorio']
    },
    img: {
        type: String,
        required: [true, 'La imagen es obligatoria']
    },
    request: {
        type: Schema.Types.ObjectId,
        ref: 'Request',
        required: [true, 'La solicitud es obligatoria']
    }
});

requestDetailSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('RequestDetail', requestDetailSchema);