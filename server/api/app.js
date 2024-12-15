import express from "express";
import bodyParser from "body-parser";
import connectDB from "./dbConnect.js";
import queueRoutes from "./routes/queueRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const port = 5000;

connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/queues", queueRoutes);
app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
