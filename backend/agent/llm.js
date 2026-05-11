import ollama from "ollama";
import axios from "axios";
import { StateGraph, END } from "@langchain/langgraph";

async function ask(prompt) {
  const res = await ollama.generate({ model: "gemma2:2b", prompt });
  return res.response.trim();
}

// ── Nodes ────────────────────────────────────────────────────────────────────

async function comparer(state) {
  console.log("[agent] comparer");
  const answer = await ask(
    `Look at this content. Is it code? If yes, does it need optimization or bug fixing?
Reply in this exact format:
IS_CODE: yes/no
NEEDS: optimize/fix/both/none

Content:
${state.content}`
  );

  const isCode = /IS_CODE:\s*yes/i.test(answer);
  const needs = (answer.match(/NEEDS:\s*(\w+)/i) || [])[1]?.toLowerCase() || "none";

  console.log(`[comparer] isCode=${isCode} needs=${needs}`);
  return { ...state, isCode, needs };
}

async function optimizer(state) {
  console.log("[agent] optimizer");
  const result = await ask(
    `Optimize the code by making it efficent like loops etc. Return only the improved code.\n\n${state.content}`
  );
  return { ...state, newContent: result };
}

async function fixer(state) {
  console.log("[agent] fixer");
  const result = await ask(
    `Fix all bugs and errors in this code. Return only the fixed code.\n\n${state.content}`
  );
  return { ...state, newContent: result };
}

function cleanCodeBlock(text) {
    text = String(text);
    text = text.slice(text.indexOf('\n') + 1);
    return text.slice(0, text.lastIndexOf("```"));

}
async function sender(state) {
  console.log("[agent] sender");
  

  const cleaned = cleanCodeBlock(state.newContent); 

  await axios.put(
    `http://localhost:3000/files/${state.fileId}`,
    { content: cleaned },
    { headers: { Authorization: `Bearer ${state.token}` } }
  );
  console.log("[sender] file saved");
  return state;
}

async function codeComparer(state) {
  console.log("[agent] codeComparer");
  const result = await ask(
    `Compare the original and updated code. And say what is changed less than 20.

ORIGINAL:
${state.content}

UPDATED:
${state.newContent}`
  );
  return { ...state, response: result };
}

async function general(state) {
  console.log("[agent] general");
  const result = await ask(state.content);
  return { ...state, response: result };
}

// ── Graph ────────────────────────────────────────────────────────────────────

const graph = new StateGraph({
  channels: {
    fileId: null,
    token: null,
    content: "",
    newContent: "",
    isCode: false,
    needs: "none",
    response: "",
  },
});

graph.addNode("comparer", comparer);
graph.addNode("optimizer", optimizer);
graph.addNode("fixer", fixer);
graph.addNode("sender", sender);
graph.addNode("codeComparer", codeComparer);
graph.addNode("general", general);

graph.setEntryPoint("comparer");

graph.addConditionalEdges("comparer", (state) => {
  if (!state.isCode) return "general";
  if (state.needs === "fix" || state.needs === "both") return "fixer";
  if (state.needs === "optimize") return "optimizer";
  return "sender";
});

graph.addEdge("fixer", "sender");
graph.addEdge("optimizer", "sender");
graph.addEdge("sender", "codeComparer");
graph.addEdge("codeComparer", END);
graph.addEdge("general", END);

const app = graph.compile();

// ── Export ───────────────────────────────────────────────────────────────────

async function response(fileId, content, token) {
  try {
    const finalState = await app.invoke({
      fileId,
      token,
      content,
      newContent: content,
      isCode: false,
      needs: "none",
      response: "",
    });

    return { content: finalState.response };
  } catch (err) {
    console.error("[ERROR]", err);
    return { error: err.message };
  }
}

export default response;