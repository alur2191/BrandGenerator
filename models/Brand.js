const mongoose = require('mongoose')


const BrandSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    purpose: {
        type: String
    },
    vision: {
        type: String,
    },
    mission: {
        type: String,
    },
    values: {
        type: String,
    }
})

module.exports = Brand = mongoose.model('brand', BrandSchema)