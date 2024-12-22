import express from "express";
import bodyParser from "body-parser";
import connectDB from "./dbConnect.js";
import queueRoutes from "./routes/queueRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";
connectDB();


const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello world");
});
app.listen(5000, () => {
  console.log("Server is running on port 3001");
});


app.use("/api/queues", queueRoutes);
app.use("/api/users", userRoutes);

export default (req, res) => {
  app(req, res);
};
