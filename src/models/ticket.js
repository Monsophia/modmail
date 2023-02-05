const mongoose = require("mongoose");

const ticket = new mongoose.Schema({ _id: String, channel: String, }, { versionKey: false });

module.exports = mongoose.model("ticket", ticket);
