import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },

  fileName: {
    type: String,
    required: true,
  },

  content: {
    type: String,
    required: true,
  },

  path: {
    type: String,
    required: true,
  },
});

export const File = mongoose.model("File", fileSchema);
