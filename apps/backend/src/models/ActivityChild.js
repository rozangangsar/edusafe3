import mongoose from "mongoose";
import { authMiddleware, roleRequired } from "../middlewares/authMiddleware.js";

//model data catatan anak / Daily log

const ActivityChildSchema = new mongoose.Schema({
  ChildID: { type: mongoose.Schema.Types.ObjectId, ref: 'Child', required: true },
  Activity: {type: String, enum: [ "Senam Pagi","Kegiatan Bermain","Kegiatan Bercerita","Makan Siang","Jam Pulang"], required: true},
  TeacherID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  Date: { type: Date, default: Date.now },
  TimeStart: { type: String, required: true },
  TimeEnd: { type: String, required: true },
  AdditionalNotes: { type: String }
}, { timestamps: true });

export default mongoose.model("ActivityChild", ActivityChildSchema);
