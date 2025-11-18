import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  parentID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  childID:  { type: mongoose.Schema.Types.ObjectId, ref: "Child" },
  message:  { type: String, required: true, trim: true, maxlength: 2000 }
}, { timestamps: true });

export default mongoose.model("Feedback", FeedbackSchema);
