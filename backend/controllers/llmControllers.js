
import { runAgent } from "../agent/agent.js";

// export const getResponse = async (req, res) => {
//   const message = req.body.message;
//   const fileId = req.body.fileId;
//   const token = req.body.token;
//   await response(fileId, message, token, res);
// };
export const getResponse = async (req, res) => {

  
  // Just call it. Don't loop. Don't res.end() here.
  await runAgent({ 
    token: req.body.token, 
    files: req.body.files, 
    projectId: req.body.projectId, 
    prompt: req.body.prompt, 
    lang: req.body.lang,
    res 
  });
};