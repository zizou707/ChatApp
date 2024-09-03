const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String },
  },
  { timestamps: true }
);

// static signup method
userSchema.statics.signup = async function (
  name,
  email,
  password,
  profileImage
) {
  // validation
  if (!name) {
    throw Error("Name is required");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough");
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ name, email, password: hash, profileImage });

  return user;
};

// static login method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Invalid email or password...");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Invalid email or password...");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
