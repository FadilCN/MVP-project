import { Chat } from "../models/chatModel.js";

export const createChat = async (req, res) => {
  const { projectId } = req.body;
  const chat = await Chat.create({
    projectId: projectId,
    history: ["AI: Hi, how can I help you today?"],
  });
  res.status(201).json(chat);
};

export const getChat = async (req, res) => {
  const { projectId } = req.params;
  const chat = await Chat.findOne({ projectId });
  res.status(200).json(chat);
};

export const updateChat = async (req, res) => {
  const { projectId } = req.params;
  const { message } = req.body;

  const chat = await Chat.findOneAndUpdate(
    { projectId },
    { $push: { history: message } },
    { new: true },
  );
  res.status(200).json(chat);
};
