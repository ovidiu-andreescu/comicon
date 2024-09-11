const mongoose = require('mongoose');

const UniverseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    frequency: {
        type: String,
        required: true
    }
});


const Universe = mongoose.model('Universe', UniverseSchema);  

module.exports = { Universe, UniverseSchema }; 
