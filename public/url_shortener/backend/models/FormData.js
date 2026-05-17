const mongoose = require('mongoose')


const formDataSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    ipaddres: {
        type: String
    },

    DeviceInfo: {
        type: String

    }
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model("SignUpFormData", formDataSchema);