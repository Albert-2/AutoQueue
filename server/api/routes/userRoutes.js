import express from "express";
import Queue from "../models/queue.js";
import User from "../models/user.js";

const router = express.Router();

// Route to register a user in a queue
router.post("/:queueId/register", async (req, res) => {
  try {
    const { queueId } = req.params;
    const { name, contact } = req.body;

    const queue = await Queue.findById(queueId);
    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    const user = new User({
      queueId,
      name,
      contact,
      position: queue.users.length + 1,
    });
    await user.save();

    queue.users.push(user);
    await queue.save();

    res.status(200).json({
      message: "Registration successful",
      position: user.position,
      estimatedWaitTime: queue.timePerPerson * user.position,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to register user", error });
  }
});

export default router;
