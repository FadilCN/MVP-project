import { Project } from "../models/projectModel.js";

export const createProject = async (req, res) => {
  const { name, type } = req.body;
  const userId = req.payload.userId;

  const project = await Project.create({
    userId,
    name,
    type,
  });

  res.json(project);
};

//get all projects of a user
export const getProjects = async (req, res) => {
  const userId = req.payload.userId;
  const projects = await Project.find({ userId });
  res.json(projects);
};

//get a single project by id
export const getProjectById = async (req, res) => {
  const userId = req.payload.userId;
  const { id } = req.params;
  const project = await Project.findOne({ _id: id, userId });

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }
  res.json(project);
};

// update a project
export const updateProject = async (req, res) => {
  const userId = req.payload.userId;
  const { id } = req.params;
  const { name, type } = req.body;

  const project = await Project.findOneAndUpdate(
    { _id: id, userId },
    { name, type },
    { new: true },
  );

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  res.json(project);
};

export const deleteProject = async (req, res) => {
  const userId = req.payload.userId;
  const { id } = req.params;

  const project = await Project.findOneAndDelete({ _id: id, userId });

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  res.json({ message: "Project deleted successfully" });
};
