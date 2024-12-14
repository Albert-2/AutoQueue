import mongoose from "mongoose";

const queueSchema = new mongoose.Schema({
  name: String,
  location: String,
  maxCapacity: Number,
  timePerPerson: Number, // in minutes
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Queue = mongoose.model("Queue", queueSchema);

export default Queue;
