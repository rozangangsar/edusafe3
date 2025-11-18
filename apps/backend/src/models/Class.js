import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true },   // ex: "1A"
  grade: { type: Number, required: true },  // ex: 1
homeroomTeacherIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
schoolYear: { type: String, required: true }         // ex: "2025/2026" (optional)
}, { timestamps: true });

ClassSchema.index({ schoolYear: 1, homeroomTeacherIDs: 1 }, { unique: true, sparse: true });


export default mongoose.model("Class", ClassSchema);
