

app.post('/run', (req, res) => {
  const { fileName, content } = req.body;
  const tmpPath = `/tmp/${fileName}`;
  const ext = fileName.split('.').pop();

  const runners = {
    js: 'node',
    py: 'python3',
  };

  const runner = runners[ext];
  if (!runner) return res.json({ output: `Unsupported file type: .${ext}` });

  fs.writeFileSync(tmpPath, content);

  exec(`${runner} ${tmpPath}`, (err, stdout, stderr) => {
    fs.unlinkSync(tmpPath);
    res.json({ output: stdout || stderr || err?.message });
  });
});