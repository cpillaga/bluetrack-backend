const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let branchOfficeSchema = new Schema({
    name: {
        type: String,
        required: [true, 'La razón social es obligatoria']
    },
    phone: {
        type: String,
        required: [true, 'El representante es obligatorio']
    },
    address: {
        type: String,
        required: [true, 'El correo es obligatorio']
    },
    status: {
        type: String,
        default: true
    },
    canton: {
        type: Schema.Types.ObjectId,
        ref: 'Canton',
        required: [true, 'El cantón es obligatorio']
    },
    business: {
        type: Schema.Types.ObjectId,
        ref: 'Business',
        required: [true, 'La empresa es obligatorio']
    }
});

branchOfficeSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('BranchOffice', branchOfficeSchema);