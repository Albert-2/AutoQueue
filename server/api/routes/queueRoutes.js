import express from "express";
import Queue from "../models/queue.js";
import User from "../models/user.js";
import qrcode from "qrcode";

const router = express.Router();

// Route to create a new queue
router.post("/newQueue", async (req, res) => {
  try {
    const { name, location, maxCapacity, timePerPerson } = req.body;
    const queueData = { name, location, timePerPerson };
    if (maxCapacity) {
      queueData.maxCapacity = maxCapacity;
    }

    const queue = new Queue(queueData);
    await queue.save();

    const qrCodeUrl = await qrcode.toDataURL(
      `http://localhost:3000/register?queueId=${queue._id}`
    );

    res.status(201).json({
      message: "Queue created successfully",
      queueId: queue._id,
      qrCodeUrl,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create queue", error });
  }
});

// Route to get all queues
router.get("/", async (req, res) => {
  try {
    const queues = await Queue.find();
    res.json(queues);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch queues", error });
  }
});

// Route to get queue details (e.g., user list)
router.get("/info/:queueId", async (req, res) => {
  try {
    const { queueId } = req.params;
    const queue = await Queue.findById(queueId).populate("users");
    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    res.json(queue);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch queue details", error });
  }
});

// Route to delete a user from the queue
router.delete("/:queueId/user/:userId", async (req, res) => {
  try {
    const { queueId, userId } = req.params;
    const queue = await Queue.findById(queueId);
    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    queue.users = queue.users.filter((u) => u.toString() !== userId);
    await queue.save();

    const remainingUsers = await User.find({ queueId }).sort("position");
    for (let i = 0; i < remainingUsers.length; i++) {
      remainingUsers[i].position = i + 1;
      await remainingUsers[i].save();
    }

    res.status(200).json({
      message: "User removed from the queue successfully",
      updatedQueue: queue,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove user", error });
  }
});

// Route to delete a queue and its users
router.delete("/del/:queueId", async (req, res) => {
  try {
    const { queueId } = req.params;

    // Find the queue
    const queue = await Queue.findById(queueId);
    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    // Remove all users associated with the queue
    await User.deleteMany({ queueId });

    // Delete the queue itself
    await Queue.findByIdAndDelete(queueId);

    res
      .status(200)
      .json({ message: "Queue and its users deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete queue", error });
  }
});

export default router;
