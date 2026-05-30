const mongoose = require('mongoose')

const Login_Schema = new mongoose.Schema({
    LogedInBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SignUpFormData",
        required: true,
        index : true
    },

    IpAddress : {
        type : String
    },
    DeviceInfo : {
        type : String
    },

    status: {
    type: String,
    enum: ["SUCCESS", "FAILED"],
    required: true,
    index: true
  }
},

{
    timestamps : true
})

module.exports = mongoose.model("LoginLogs", Login_Schema);