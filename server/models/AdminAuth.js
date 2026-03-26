import mongoose from "mongoose";

const adminAuthSchema = new mongoose.Schema(
  {
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
      required: true,
      unique: true,
    },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.AdminAuth ||
  mongoose.model("AdminAuth", adminAuthSchema);
