import mongoose from "mongoose";

const doctorAuthSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      unique: true,
    },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }, // bcrypt hash
  },
  { timestamps: true }
);

export default mongoose.models.DoctorAuth ||
  mongoose.model("DoctorAuth", doctorAuthSchema);
