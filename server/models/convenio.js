const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let agreementSchema = new Schema({
    description: {
        type: String,
        required: [true, 'La descripcion es obligatorio']
    },
    price: {
        type: String,
        required: [true, 'El precio es obligatorio']
    },
    cantonOrigen: {
        type: Schema.Types.ObjectId,
        ref: 'Canton',
        required: [true, 'El cantón es obligatorio']
    },
    cantonDestino: {
        type: Schema.Types.ObjectId,
        ref: 'Canton',
        required: [true, 'El cantón es obligatorio']
    },
    img: {
        type: String,
        required: [true, 'La imagen es obligatoria']
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

module.exports = mongoose.model('Agreement', agreementSchema);