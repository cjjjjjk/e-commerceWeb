const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  authProvider: { type: String, enum: ['local', 'google'], required: true }, 
  uid: { type: String, unique: true, sparse: true }, 
  email: { type: String, required: true, unique: true },
  emailVerified: { type: Boolean, default: false},
  photoUrl: { type: String },
  phone: {type: String, required: false},
  address: {type: String, required: false},
  password: { type: String, select: false }, 
  displayName: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, 
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
