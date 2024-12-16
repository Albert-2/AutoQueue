import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  queueId: { type: mongoose.Schema.Types.ObjectId, ref: "Queue" },
  position: Number,
});

const User = mongoose.model("User", userSchema);

export default User;
