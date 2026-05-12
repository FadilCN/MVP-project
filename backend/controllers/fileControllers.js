import { File } from "../models/FileModel.js";

export const createFile = async (req, res) => {
  const { projectId, fileName, content, path } = req.body; // get projectId from request body save it in frontend when making

  const file = await File.create({
    projectId,
    fileName,
    content,
    path,
  });

  res.json(file);
};

// get all files of a project
export const getFilesByProject = async (req, res) => {
  const { projectId } = req.params;
  const files = await File.find({ projectId });

  res.json(files);
};

//get a single file by id
export const getFileById = async (req, res) => {
  const { id } = req.params;
  const file = await File.findById(id);

  if (!file) {
    return res.status(404).json({ message: "File not found" });
  }

  res.json(file);
};

// update a file
export const updateFile = async (req, res) => {
  const { id } = req.params;
  const { fileName, content, path } = req.body;

  const file = await File.findByIdAndUpdate(
    id,
    { fileName, content, path },
    { new: true },
  );

  if (!file) {
    return res.status(404).json({ message: "File not found" });
  }

  res.json(file);
};

//delete a file
export const deleteFile = async (req, res) => {
  const { id } = req.params;

  const file = await File.findByIdAndDelete(id);
  if (!file) {
    return res.status(404).json({ message: "File not found" });
  }
  res.json({ message: "File deleted successfully" });
};

// update file content by file name
// update file content by file name AND project ID
export const updateFileByName = async (req, res) => {
  const { projectId, fileName } = req.params; // Get both from the URL
  const { content } = req.body;

  try {
    const file = await File.findOneAndUpdate(
      { fileName, projectId }, // Query: both must match
      { content }, 
      { new: true } 
    );

    if (!file) {
      return res.status(404).json({ message: "File not found in this project" });
    }

    res.json(file);
  } catch (error) {
    res.status(500).json({ message: "Error updating content", error: error.message });
  }
};
