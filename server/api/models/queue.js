import mongoose from "mongoose";

const queueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  maxCapacity: { type: Number, default: 30 },
  timePerPerson: { type: Number, default: 5 },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Queue = mongoose.model("Queue", queueSchema);

export default Queue;
