// src/models/Child.js
import mongoose from "mongoose";

const ChildSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  birthDate: { type: Date,   required: true },
  parentID:  { type: mongoose.Schema.Types.ObjectId, ref: "User",  required: true },
  classId:   { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: false }
}, { timestamps: true });

ChildSchema.index({ classId: 1 });
ChildSchema.index({ parentID: 1, name: 1 }, { unique: false }); // ubah ke true kalau mau cegah duplikat keras

ChildSchema.set("toJSON", {
  transform: (_, doc) => {
    doc.id = doc._id;
    delete doc._id;
    delete doc.__v;
    return doc;
  }
});

export default mongoose.model("Child", ChildSchema);
