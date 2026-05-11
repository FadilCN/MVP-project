import express from "express";
import fs from "fs";
import { exec } from "child_process";
import path from "path";

const router = express.Router();

router.post("/run", (req, res) => {
  // files: the array of objects you showed
  // runFileName: the name of the file you want to execute (e.g., 'test.js')
  const { files, runFileName } = req.body;

  if (!files || !Array.isArray(files)) {
    return res.status(400).json({ output: "No files provided." });
  }

  // 1. Save all files to /tmp first so they can reference each other
  files.forEach((file) => {
    const filePath = path.join("/tmp", file.fileName);
    fs.writeFileSync(filePath, file.content);
  });

  // 2. Identify the runner for the specific file you want to run
  const ext = runFileName.split(".").pop();
  const runners = {
    js: "node",
    py: "python3",
  };

  const runner = runners[ext];

  if (!runner) {
    return res.json({
      output: `Unsupported file type: .${ext}`,
    });
  }

  const execPath = path.join("/tmp", runFileName);

  // 3. Execute the target file
  exec(`${runner} ${execPath}`, (err, stdout, stderr) => {
    // 4. Clean up: Remove all files from /tmp after execution
    files.forEach((file) => {
      const filePath = path.join("/tmp", file.fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    res.json({
      output: stdout || stderr || err?.message,
    });
  });
});

export default router;