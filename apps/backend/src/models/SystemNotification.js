import mongoose from "mongoose";

const SystemNotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true , maxlength: 1000 },
  audience: { type: String, enum: ["all","parents","teachers"], default: "all" },
  tags: [{ type: String }],
  validFrom: { type: Date, required: true },
  validTo: { type: Date },
  dedupeKey: { type: String, unique: true } // cegah duplikat harian
}, { timestamps: true });

export default mongoose.model("SystemNotification", SystemNotificationSchema);