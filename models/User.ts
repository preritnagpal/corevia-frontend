// src/models/User.ts
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    role: String,

    // dynamic data
    data: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);
