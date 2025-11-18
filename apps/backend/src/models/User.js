import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: true, select: true },
  role: String,
}, { timestamps: true });

// paksa nama koleksi = 'users'
const User = mongoose.model('User', userSchema, 'users');
export default User;

