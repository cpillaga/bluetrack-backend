const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let operatorSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatoria']
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio']
    },
    phone: {
        type: String,
        required: [true, 'El teléfono es obligatorio']
    },
    address: {
        type: String,
        required: [true, 'La direccion es obligatorio']
    },
    user: {
        type: String,
        unique: true,
        required: [true, 'El usuario es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    role: {
        type: String,
        required: [true, 'El rol es obligatoria']
    },
    status: {
        type: String,
        default: true
    },
    branchOffice: {
        type: Schema.Types.ObjectId,
        ref: 'BranchOffice',
        required: [true, 'La sucursal es obligatorio']
    }
});

operatorSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });

module.exports = mongoose.model('Operator', operatorSchema);