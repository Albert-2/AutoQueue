import express from "express";
import Queue from "../models/queue.js";
import User from "../models/user.js";
import nodemailer from "nodemailer";

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Route to register a user in a queue
router.post("/:queueId/register", async (req, res) => {
  try {
    const { queueId } = req.params;
    const { name, email } = req.body;

    const queue = await Queue.findById(queueId);
    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    const existingUser = await User.findOne({ email, queueId });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email is already registered in the queue",
      });
    }
    const user = new User({
      queueId,
      name,
      email,
      position: queue.users.length + 1,
    });
    await user.save();

    queue.users.push(user);
    await queue.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Queue Registration Confirmation",
      text: `Hello ${name},\n\nYou have been successfully registered in the queue: ${queue.name}.\nYour position is ${user.position}.\n\nLocation: ${queue.location}\nMax Capacity: ${queue.maxCapacity}\n\nThank you!`,
    };

    transporter.sendMail(mailOptions);

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
