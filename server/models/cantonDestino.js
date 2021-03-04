const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let destCantonSchema = new Schema({
    status: {
        type: String,
        required: [true, 'El estado es obligatorio']
    },
    startingPrice: {
        type: Number,
        required: [true, 'El precio inicial es obligatorio']
    },
    additionalPrice: {
        type: Number,
        required: [true, 'El precio adicional es obligatorio']
    },
    canton: {
        type: Schema.Types.ObjectId,
        ref: 'Canton',
        required: [true, 'El cantón es obligatorio']
    },
    branchOffice: {
        type: Schema.Types.ObjectId,
        ref: 'BranchOffice',
        required: [true, 'La sucursal es obligatorio']
    }
});

destCantonSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('DestCanton', destCantonSchema);