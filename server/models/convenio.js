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
    canton: {
        type: Schema.Types.ObjectId,
        ref: 'Canton',
        required: [true, 'El cantón es obligatorio']
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