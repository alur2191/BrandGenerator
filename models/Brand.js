const mongoose = require('mongoose')


const BrandSchema = new mongoose.Schema({
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