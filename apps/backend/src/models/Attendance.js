import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  childID: { type: mongoose.Schema.Types.ObjectId, ref: "Child", required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ["hadir", "sakit", "izin", "alfa"], default: "hadir" },
  checkIn: { type: Date },
  checkOut: { type: Date },
  teacherID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  note: { type: String }
},{ timestamps: true });

AttendanceSchema.index({ childID:1, date:1 }, { unique: true });

export default mongoose.model("Attendance", AttendanceSchema);
