import { ChatOllama } from "@langchain/ollama";
import { StateGraph, Annotation } from "@langchain/langgraph";
import { z } from "zod";
import axios from "axios";

export async function runAgent({ token, files, projectId, prompt, res, lang }) {
  // SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const send = (msg) => res.write(` ${msg}\n\n`);

  const apiClient = axios.create({
    baseURL: "http://localhost:3000/files",
    headers: { Authorization: `Bearer ${token}` },
  });

  const FileActionSchema = z.object({
    actions: z.array(
      z.object({
        action: z.enum(["create", "update", "delete"]),
        _Id: z.string().optional(),
        fileName: z.string(),
        content: z.string(),
      })
    ),
  });

  const GraphState = Annotation.Root({
    query:           Annotation({ reducer: (_, y) => y }),
    context:         Annotation({ reducer: (_, y) => y }),
    plan:            Annotation({ reducer: (_, y) => y }),
    executionStatus: Annotation({ reducer: (x, y) => x.concat(y), default: () => [] }),
  });

  const plannerNode = async (state) => {
    send("Agent thinking...");

    const llm = new ChatOllama({
      model: "gemma2:2b",
      temperature: 0,
      format: "json",
    }).withStructuredOutput(FileActionSchema);
    

    const systemMessage = `
You are a coding assistant. Analyze the project context and user query in ${lang} language.
- If fixing existing code: action='update', use the existing _Id.
- If creating new code: action='create'.
- Output ONLY valid JSON.
    `;

    const userMessage = `
Project ID: ${projectId}
Existing Files:
${JSON.stringify(state.context, null, 2)}
User Query: ${state.query}
    `;

    try {
      console.log("running llm")
      const response = await llm.invoke([
        ["system", systemMessage],
        ["user", userMessage],
      ]);
      send("Planning done.");
      console.log(response.actions);
      return { plan: response.actions };
    } catch (error) {
      send("Planning failed.");
      return { plan: [] };
    }
  };

  const executorNode = async (state) => {

     send("Agent started Exicuting...");
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

        }
      } catch (err) {
        const reason = err.response?.data?.message ?? err.message;
        send(`Failed ${task.action} on ${task.fileName}: ${reason}`);
      }
    }

    return { executionStatus: ["done"] };
  };

  const workflow = new StateGraph(GraphState)
    .addNode("planner", plannerNode)
    .addNode("executor", executorNode)
    .addEdge("__start__", "planner")
    .addEdge("planner", "executor")
    .addEdge("executor", "__end__");

  const app = workflow.compile();

  await app.invoke({ query: prompt, context: files });

  send("Done.");
  res.end();
}