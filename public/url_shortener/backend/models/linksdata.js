const mongoose = require('mongoose')

const LinksDataSchema = new mongoose.Schema({

    usedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SignUpFormData",
        required: true,
    },

    originalLink: {
        type: String,
        required: true
    },

    randomId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    password: {
        type: String
    },

    ExpiryDate: {
        type: Date
    },


    status: {
        type: String,
        enum: ["ACTIVE", "EXPIRED"],
        required: true
    }

},

    {
        timestamps: true
    }

)



module.exports = mongoose.model("LinksData", LinksDataSchema)