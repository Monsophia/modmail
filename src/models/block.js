const mongoose = require("mongoose");

const block = new mongoose.Schema({ _id: String, reason: String }, { versionKey: false });

module.exports = mongoose.model("block", block);
