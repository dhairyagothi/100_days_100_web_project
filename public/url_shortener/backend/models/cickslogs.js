const mongoose = require('mongoose')

const clickLogsSchema = new mongoose.Schema({

    randomID  : {
    type: String,
    required: true,
    index: true
  },

  clicks: {
    type: Number,
    required: true,
    default: 0
  },


  ipAddress: String,

  deviceInfo: String

}, {
  timestamps: true
});

module.exports = mongoose.model("ClicksLogs", clickLogsSchema)