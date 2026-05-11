// agent.js
import { StateGraph, END, Annotation } from "@langchain/langgraph";
import { ChatOllama } from "@langchain/ollama";

const llm = new ChatOllama({ model: "gemma2:2b" });

const State = Annotation.Root({
  files: Annotation({ default: () => [] }),
  // Storing raw strings instead of parsed objects
  results: Annotation({ default: () => [], reducer: (a, b) => [...a, ...b] }),
});

async function processFiles(state) {
  const responses = [];

  for (const file of state.files) {
    console.log(`Analyzing: ${file.fileName}...`);

    const response = await llm.invoke([
      { role: "system", content: "Review this code and provide feedback." },
      { role: "user", content: `Code:\n${file.content}` },
    ]);

    responses.push({
      file: file.fileName,
      rawFeedback: response.content,
    });
  }

  return { results: responses };
}

const workflow = new StateGraph(State)
  .addNode("process", processFiles)
  .addEdge("__start__", "process")
  .addEdge("process", END);

const app = workflow.compile();

/**
 * Main function accepting the JSON array
 */
export async function runCodeReview(jsonData) {
  const result = await app.invoke({ files: jsonData });

  // Returns the array of results containing file names and raw LLM text
  return result.results;
}
