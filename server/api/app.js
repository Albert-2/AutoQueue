import express from "express";
import bodyParser from "body-parser";
import connectDB from "./dbConnect.js"; // Import the database connection function
import queueRoutes from "./routes/queueRoutes.js"; // Import Queue routes
import userRoutes from "./routes/userRoutes.js"; // Import User routes

const app = express();
const port = 5000;

// Connect to the database
connectDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use the imported routes
app.use("/api/queues", queueRoutes);
app.use("/api/users", userRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
