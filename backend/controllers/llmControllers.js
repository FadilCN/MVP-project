import response from "../agent/llm.js";

export const getResponse = async (req, res) => {
  const message = req.body.message;
  const fileId = req.body.fileId;
  const token = req.body.token;
  await response(fileId, message, token, res);
};
