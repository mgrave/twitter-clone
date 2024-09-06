import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import tweetRoutes from "./routes/tweetRoutes.js";
import { connectGridFS } from "./config/gridfsConfig.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

await connectDB();
await connectGridFS();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/tweets", tweetRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
