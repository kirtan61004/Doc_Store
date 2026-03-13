const mongoose = require("mongoose");

const OtpStoreSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // auto-delete after 5 min
});

module.exports = mongoose.model("OtpStore", OtpStoreSchema);
