import app from "./app.js";
import express from "express";

import dotenv from "dotenv";
dotenv.config();

import { connectDatabase } from "./database/connection.js";



app.use(express.json());

const PORT = process.env.PORT || 3000;


const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.log("DB connection failed:", err);
  }
};

startServer();