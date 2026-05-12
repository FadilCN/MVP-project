import { ChatOllama } from "@langchain/ollama";
import { StateGraph, Annotation } from "@langchain/langgraph";
import { z } from "zod";
import axios from "axios";

export async function runAgent({ token, files, projectId, prompt, res, lang }) {
  // SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const send = (msg) => res.write(`data: ${msg}\n\n`);

  const apiClient = axios.create({
    baseURL: "http://localhost:3000/files",
    headers: { Authorization: `Bearer ${token}` },
  });

  // ── Schemas ────────────────────────────────────────────────────────────────

  const IntentSchema = z.object({
    intent: z.enum(["create", "update", "fix_bug"]),
    reasoning: z.string(),
  });

  const FileSelectionSchema = z.object({
    fileNames: z.array(z.string()),
  });

  const FileActionSchema = z.object({
    actions: z.array(
      z.object({
        action: z.enum(["create", "update", "delete"]),
        _Id: z.string().optional(),
        fileName: z.string(),
        content: z.string(),
        path: z.string().optional(),
      })
    ),
  });

  // ── Graph State ────────────────────────────────────────────────────────────

  const GraphState = Annotation.Root({
    query:           Annotation({ reducer: (_, y) => y }),
    context:         Annotation({ reducer: (_, y) => y }),    // full files array
    selectedFiles:   Annotation({ reducer: (_, y) => y }),    // filtered subset
    intent:          Annotation({ reducer: (_, y) => y }),    // "create" | "update" | "fix_bug"
    plan:            Annotation({ reducer: (_, y) => y }),
    executionStatus: Annotation({ reducer: (x, y) => x.concat(y), default: () => [] }),
  });

  // ── Node 1: Intent Classifier ──────────────────────────────────────────────

  const intentNode = async (state) => {
    send("Agent classifying intent...");

    const llm = new ChatOllama({
      model: "gemma2:2b",
      temperature: 0,
      format: "json",
    }).withStructuredOutput(IntentSchema);

    const systemMessage = `
You are an intent classifier for a coding assistant.
Given a user query, decide if the user wants to:
- "create": build something new (new file, new feature from scratch)
- "update": modify or refactor specific existing files
- "fix_bug": fix a bug or error (requires full project context)
Output ONLY valid JSON.
    `;

    const userMessage = `User Query: ${state.query}`;

    try {
      console.log("running intent classifier");
      const response = await llm.invoke([
        ["system", systemMessage],
        ["user", userMessage],
      ]);
      send(`Intent detected: ${response.intent} — ${response.reasoning}`);
      console.log("intent:", response.intent, "|", response.reasoning);
      return { intent: response.intent };
    } catch (error) {
      console.error("Intent classification failed:", error);
      send("Intent classification failed, defaulting to fix_bug.");
      return { intent: "fix_bug" };
    }
  };

  // ── Node 2: File Selector (only runs for "update") ─────────────────────────

  const fileSelectorNode = async (state) => {
    send("Agent selecting relevant files...");

    // For "create": pass nothing — planner gets empty context
    if (state.intent === "create") {
      send("Create intent — no existing files needed.");
      return { selectedFiles: [] };
    }

    // For "fix_bug": pass ALL files
    if (state.intent === "fix_bug") {
      send("Fix bug intent — passing all files to planner.");
      return { selectedFiles: state.context };
    }

    // For "update": ask LLM which file names are relevant, then filter
    const llm = new ChatOllama({
      model: "gemma2:2b",
      temperature: 0,
      format: "json",
    }).withStructuredOutput(FileSelectionSchema);

    const fileNames = state.context.map((f) => f.fileName).join(", ");

    const systemMessage = `
You are a file relevance selector.
Given a list of file names and a user query, return only the file names that need to be changed.
Output ONLY valid JSON with a "fileNames" array.
    `;

    const userMessage = `
Available files: ${fileNames}
User Query: ${state.query}
    `;

    try {
      console.log("running file selector");
      const response = await llm.invoke([
        ["system", systemMessage],
        ["user", userMessage],
      ]);
      console.log("selected file names:", response.fileNames);

      const selected = state.context.filter((f) =>
        response.fileNames.includes(f.fileName)
      );
      send(`Files selected: ${selected.map((f) => f.fileName).join(", ")}`);
      return { selectedFiles: selected };
    } catch (error) {
      console.error("File selection failed:", error);
      send("File selection failed, falling back to all files.");
      return { selectedFiles: state.context };
    }
  };

  // ── Node 3: Planner ────────────────────────────────────────────────────────

  const plannerNode = async (state) => {
    send("Agent thinking...");

    // plannerNode
const llm = new ChatOllama({
  model: "qwen2.5-coder:1.5b",
  temperature: 0,
  format: "json",
}).withStructuredOutput(FileActionSchema);

    const systemMessage = `
You are a coding assistant. Analyze the project context and user query in ${lang} language.
- You MUST generate one action per file requested. If the user asks for 2 files, return 2 actions. If 3 files, return 3 actions.
- If fixing existing code: action='update', use the existing _Id.
- Dont create new file if the filename already exists JUST UPDATE the existing file.
- If creating new code: action='create'.
- NEVER merge multiple files into one action.
- Output ONLY valid JSON.
    `;

    // selectedFiles is empty for "create", filtered for "update", full for "fix_bug"
    const contextToPass = state.selectedFiles;

    const userMessage = `
Project ID: ${projectId}
Existing Files:
${JSON.stringify(contextToPass, null, 2)}
User Query: ${state.query}

IMPORTANT: If multiple files are requested, you MUST return one action per file in the actions array.
    `;
    

    try {
      console.log("running planner llm");
      const response = await llm.invoke([
        ["system", systemMessage],
        ["user", userMessage],
      ]);
      send("Planning done.");
      console.log(response.actions);
      return { plan: response.actions };
    } catch (error) {
      console.error("Planning failed:", error);
      send("Planning failed.");
      return { plan: [] };
    }
  };

  // ── Node 4: Executor ───────────────────────────────────────────────────────

  const executorNode = async (state) => {
    send("Agent started executing...");

    if (!state.plan || state.plan.length === 0) {
      send("Nothing to do.");
      return { executionStatus: [] };
    }

    for (const task of state.plan) {
      send(`Agent ${task.action}ing ${task.fileName}...`);

      try {
        switch (task.action) {
          case "create":
            await apiClient.post("/create", {
              projectId,
              fileName: task.fileName,
              content: task.content || " ",
              path: task.path || "/",
            });
            send(`Created ${task.fileName}`);
            break;

          case "update":
            await apiClient.put(
              `/${projectId}/${encodeURIComponent(task.fileName)}`,
              { content: task.content }
            );
            send(`Updated ${task.fileName}`);
            break;

          case "delete":
            await apiClient.delete(
              `/${projectId}/${encodeURIComponent(task.fileName)}`
            );
            send(`Deleted ${task.fileName}`);
            break;
        }
      } catch (err) {
        const reason = err.response?.data?.message ?? err.message;
        send(`Failed ${task.action} on ${task.fileName}: ${reason}`);
      }
    }

    return { executionStatus: ["done"] };
  };

  // ── Graph ──────────────────────────────────────────────────────────────────

  const workflow = new StateGraph(GraphState)
    .addNode("intentClassifier", intentNode)
    .addNode("fileSelector",     fileSelectorNode)
    .addNode("planner",          plannerNode)
    .addNode("executor",         executorNode)
    
    .addEdge("__start__",        "intentClassifier")
    .addEdge("intentClassifier", "fileSelector")
    .addEdge("fileSelector",     "planner")
    .addEdge("planner",          "executor")
    .addEdge("executor",         "__end__");

  const app = workflow.compile();

  await app.invoke({ query: prompt, context: files });

  send("Done.");
  res.end();
}