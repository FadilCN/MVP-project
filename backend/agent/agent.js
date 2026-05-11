// agent.js

import { StateGraph, END, Annotation } from "@langchain/langgraph";
import { ChatOllama } from "@langchain/ollama";

// ─── Mock file store ─────────────────────────────────────────────
const FILE_STORE = {
  "file-001": {
    content: "function login() { eval(userInput) }",
    next: "file-002",
  },
  "file-002": {
    content: "const x = 42;",
    next: "file-003",
  },
  "file-003": {
    content: "app.get('*', (req,res) => res.send(req.query))",
    next: null,
  },
};

// ─── LLM ─────────────────────────────────────────────────────────
const llm = new ChatOllama({
  model: "gemma2:2b",
});

// ─── State ───────────────────────────────────────────────────────
const State = Annotation.Root({
  currentFileId: Annotation({ default: () => "" }),
  currentFileContent: Annotation({ default: () => "" }),
  history: Annotation({
    default: () => [],
    reducer: (a, b) => [...a, ...b],
  }),
  issues: Annotation({
    default: () => [],
    reducer: (a, b) => [...a, ...b],
  }),
  summary: Annotation({ default: () => "" }),
});

// ─── Helper: Safe JSON parse ─────────────────────────────────────
function safeJSONParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  }
}

// ─── Nodes ───────────────────────────────────────────────────────

// 🔍 Check file for issues
async function checkFile(state) {
  try {
    const response = await llm.invoke([
      {
        role: "system",
        content:
          'Reply ONLY as JSON: {"hasIssue": true/false, "description": "..."}',
      },
      {
        role: "user",
        content: `Review this code:\n${state.currentFileContent}`,
      },
    ]);

    const text = response.content || response;
    const result = safeJSONParse(text);

    const fileId = state.currentFileId;

    if (result.hasIssue) {
      return {
        issues: [{ file: fileId, problem: result.description }],
        history: [{ file: fileId, status: "issue" }],
      };
    } else {
      return {
        history: [{ file: fileId, status: "clean" }],
      };
    }
  } catch (err) {
    return {
      history: [{ file: state.currentFileId, status: "error" }],
      issues: [
        {
          file: state.currentFileId,
          problem: "Failed to analyze file",
        },
      ],
    };
  }
}

// ➡️ Load next file
function loadNextFile(state) {
  const nextId = FILE_STORE[state.currentFileId]?.next;

  if (!nextId) return {};

  return {
    currentFileId: nextId,
    currentFileContent: FILE_STORE[nextId].content,
  };
}

// 📊 Final summary
function summarize(state) {
  const { issues, history } = state;

  console.log(`\n📊 Scanned ${history.length} files`);
  console.log(`⚠️ Found ${issues.length} issue(s)\n`);

  if (issues.length === 0) {
    console.log("✅ All clean!");
  } else {
    for (const i of issues) {
      console.log(`❌ ${i.file}: ${i.problem}`);
    }
  }

  return { summary: "done" };
}

// ─── Routing ─────────────────────────────────────────────────────

function hasNextFile(state) {
  return FILE_STORE[state.currentFileId]?.next ? "loadNextFile" : "summarize";
}

// ─── Graph ───────────────────────────────────────────────────────

const graph = new StateGraph(State)
  .addNode("checkFile", checkFile)
  .addNode("loadNextFile", loadNextFile)
  .addNode("summarize", summarize)
  .addEdge("__start__", "checkFile")
  .addConditionalEdges("checkFile", hasNextFile)
  .addEdge("loadNextFile", "checkFile")
  .addEdge("summarize", END)
  .compile();

// ─── Run ─────────────────────────────────────────────────────────

await graph.invoke({
  currentFileId: "file-001",
  currentFileContent: FILE_STORE["file-001"].content,
  history: [],
  issues: [],
  summary: "",
});
