import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // 1 day in seconds
  },
});

export const BlacklistedToken = mongoose.model("BlacklistedToken", fileSchema);
