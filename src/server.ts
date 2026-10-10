import dotenv from "dotenv";
dotenv.config();

import { app } from "./app";
import mongoose from "mongoose";

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || "";

// 👈 ADD IT HERE
console.log("Attempting connection with:", process.env.MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Could not start server:", err);
  });