const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let cantonSchema = new Schema({
    description: {
        type: String,
        required: [true, 'La descripcion es obligatorio']
    },
    province: {
        type: Schema.Types.ObjectId,
        ref: 'Province',
        required: [true, 'La provincia es obligatorio']
    }
});

module.exports = mongoose.model('Canton', cantonSchema);