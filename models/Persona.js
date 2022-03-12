const mongoose = require('mongoose')

const PersonaSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
    },
    relationship: {
        type: String,
    },
    job: {
        type: String,
    },
    location: {
        type: String,
    },
    salary: {
        type: String,
    },
    budget: {
        type: String,
    }
})

module.exports = Persona = mongoose.model('persona', PersonaSchema)