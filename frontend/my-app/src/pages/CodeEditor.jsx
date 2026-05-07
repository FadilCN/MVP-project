import { useState } from 'react'
import FileBrowser from '../ui/elements/components/CodeEditor/FileBrowser'
import CodeViewer from '../ui/elements/components/CodeEditor/CodeViewer'
import AIChat from '../ui/elements/components/CodeEditor/AiChat'

const data = [
  {
    "_id": "69fb30479d4c42368a74c7e1",
    "projectId": "69fb2f5c9d4c42368a74c7da",
    "fileName": "app.py",
    "content": "from flask import Flask\napp = Flask(__name__)\n\n@app.route('/')\ndef hello():\n    return 'Hello World!'",
    "path": "src/",
    "__v": 0
  },
  {
    "_id": "69fb30479d4c42368a74c7e2",
    "projectId": "69fb2f5c9d4c42368a74c7da",
    "fileName": "requirements.txt",
    "content": "flask==3.0.0\nrequests==2.31.0\ngunicorn==21.2.0",
    "path": "",
    "__v": 0
  },
  {
    "_id": "69fb30479d4c42368a74c7e3",
    "projectId": "69fb2f5c9d4c42368a74c7da",
    "fileName": "utils.py",
    "content": "def format_date(dt):\n    return dt.strftime('%Y-%m-%d')",
    "path": "src/lib/",
    "__v": 1
  },
  {
    "_id": "69fb30479d4c42368a74c7e4",
    "projectId": "69fb2f5c9d4c42368a74c7da",
    "fileName": ".env",
    "content": "PORT=5000\nDEBUG=True\nDATABASE_URL=postgres://user:pass@localhost:5432/db",
    "path": "",
    "__v": 0
  },
  {
    "_id": "69fb30479d4c42368a74c7e5",
    "projectId": "69fb2f5c9d4c42368a74c7da",
    "fileName": "README.md",
    "content": "# Project Alpha\nThis is a sample project generated for testing purposes.",
    "path": "",
    "__v": 0
  }
]

const fileName = data.map(file => file.fileName)
const fileContent = data.map(file => file.content)
console.log(fileName)
console.log(fileContent)


function CodeEditor() {

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [topic, setTopic] = useState(fileName[0]);

  return (
    <>
      <div className="grid grid-cols-[1fr_3fr_1fr] h-screen w-screen">
        <FileBrowser fileName={fileName} setSelectedIndex={setSelectedIndex} setTopic={setTopic} />
        <CodeViewer fileName={fileName[selectedIndex]} content={fileContent[selectedIndex]} />
        <AIChat />
      </div>
    </>
  )
}

export default CodeEditor
