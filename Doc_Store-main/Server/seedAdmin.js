/**
 * Run once to create the admin user in MongoDB:
 *   node Server/seedAdmin.js
 *
 * Change the email/password below before running.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const email = "kirtankacha3@gmail.com";
  const password = "Admin@123"; // change this

  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Admin already exists:", email);
    process.exit(0);
  }

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ name: "Admin", email, password: hashed, role: "admin" });

  console.log("✅ Admin created successfully!");
  console.log("   Email   :", email);
  console.log("   Password:", password);
  process.exit(0);
})();
