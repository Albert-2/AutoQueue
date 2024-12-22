import express from "express";
import bodyParser from "body-parser";
import connectDB from "./dbConnect.js";
import queueRoutes from "./routes/queueRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";

const app = express();

connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(5000, () => {
  console.log("Server is running on port 3001");
});

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/api/queues", queueRoutes);
app.use("/api/users", userRoutes);

export default (req, res) => {
  app(req, res);
};
