import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  contact: String,
  queueId: { type: mongoose.Schema.Types.ObjectId, ref: "Queue" },
  position: Number,
});

const User = mongoose.model("User", userSchema);

export default User;
