import express from "express";
import Queue from "../models/queue.js";
import User from "../models/user.js";
import nodemailer from "nodemailer";

const router = express.Router();

const verificationCodes = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

// Route to create a new queue
router.post("/verifyCode", async (req, res) => {
  try {
    const { name, adminEmail } = req.body;

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    verificationCodes[adminEmail] = verificationCode;
    transporter.sendMail(
      {
        from: process.env.EMAIL_USER,
        to: adminEmail,
        subject: "Queue Verification Code",
        text: `Your verification code for creating the queue "${name}" is: ${verificationCode}`,
      },
      (error, info) => {
        if (error) {
          return res.status(500).json({ error: "Error sending email" });
        }
        res
          .status(200)
          .json({ message: "Verification code sent to admin email" });
      }
    );
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send verification code", error });
  }
});

// Route to verify admin and create queue
router.post("/newQueue", async (req, res) => {
  try {
    const {
      name,
      location,
      maxCapacity,
      timePerPerson,
      adminName,
      adminEmail,
      verificationCode,
    } = req.body;

    if (verificationCodes[adminEmail] != verificationCode) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code" });
    }
    const queueData = {
      name,
      location,
      timePerPerson,
      admin: { name: adminName, email: adminEmail },
    };
    if (maxCapacity) {
      queueData.maxCapacity = maxCapacity;
    }

    const queue = new Queue(queueData);
    await queue.save();

    delete verificationCodes[adminEmail];

    res.status(201).json({
      message: "Queue created successfully",
      queueId: queue._id,
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

// Route to delete a queue and its users (admin-only)
router.delete("/del/:queueId", async (req, res) => {
  try {
    const { queueId } = req.params;
    const { adminEmail, verificationCode } = req.body;

    if (verificationCodes[adminEmail] !== verificationCode) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code" });
    }

    const queue = await Queue.findById(queueId);
    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    await User.deleteMany({ queueId });

    await Queue.findByIdAndDelete(queueId);

    delete verificationCodes[adminEmail];

    res
      .status(200)
      .json({ message: "Queue and its users deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete queue", error });
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

export default router;
