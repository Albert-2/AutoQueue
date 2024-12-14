import express from "express";
import Queue from "../models/queue.js";
import qrcode from "qrcode";

const router = express.Router();

// Route to create a new queue
router.post("/", async (req, res) => {
  try {
    const { name, location, maxCapacity, timePerPerson } = req.body;
    const queue = new Queue({ name, location, maxCapacity, timePerPerson });
    await queue.save();

    // Generate QR code for the queue
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
router.get("/:queueId", async (req, res) => {
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

export default router;
