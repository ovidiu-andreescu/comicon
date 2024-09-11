const mongoose = require('mongoose');
const UniverseSchema = require('./Universe');

const CharacterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    universe: {
        type: UniverseSchema,
        required: true
    },

    apparitions: [
        {
            type: Date,
            required: true,
        }
    ]
});

module.exports = mongoose.model('Character', CharacterSchema);