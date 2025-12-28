import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // ADD THESE TWO LINES so the database accepts them:
  phone: { type: String },
  age: { type: Number },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);