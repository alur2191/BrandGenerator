const mongoose = require('mongoose')

const CompetitorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    name: {
        type: String,
        required: true
    },
    look: {
        type: String,
    },
    valueProp: {
        type: String,
    },
    tagline: {
        type: String,
    },
    coreProduct: {
        type: String,
    },
    personas: {

    },
    communication: {
        type: String
    }
})


module.exports = Competitor = mongoose.model('competitor', CompetitorSchema)