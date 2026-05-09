import  response  from "../agent/llm.js";

export const getResponse = async (req, res) => {
    const message = req.body.message;
    const result = await response(message);
    res.status(200).json(result);
};