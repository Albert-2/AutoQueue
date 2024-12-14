import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGO_USER}:${encodeURIComponent(
        process.env.MONGO_PASS
      )}@clusterzero.3yk3x.mongodb.net/${process.env.MONGO_DB}`
    );
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Failed to connect to database:", error.message);
    process.exit(1);
  }
};

export default connectDB;
