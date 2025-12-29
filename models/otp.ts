import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  hash: { type: String, required: true },
  expiresAt: { type: Number, required: true },
});

export default mongoose.models.Otp ||
  mongoose.model("Otp", OtpSchema);
