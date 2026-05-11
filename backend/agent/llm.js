import ollama from "ollama";
import axios from "axios";
import { StateGraph, END } from "@langchain/langgraph";

async function ask(prompt, res) {
  const stream = await ollama.generate({ model: "gemma2:2b", prompt, stream: true });
  let full = "";
  for await (const chunk of stream) {
    full += chunk.response;
    res.write(chunk.response);
  }
  return full.trim();
}

const sink = { write: () => {} };

async function comparer(state) {
  state.res.write("\n[analyzing content...]\n");
  const answer = await ask(`Is this code? If yes, does it need optimization or bug fixing?
Reply exactly:
IS_CODE: yes/no
NEEDS: optimize/fix/both/none

Content:
${state.content}`, sink);

  const isCode = /IS_CODE:\s*yes/i.test(answer);
  const needs = (answer.match(/NEEDS:\s*(\w+)/i) || [])[1]?.toLowerCase() || "none";
  return { ...state, isCode, needs };
}

async function optimizer(state) {
  state.res.write("\n[optimizing code...]\n");
  const result = await ask(`Optimize this code. Return only the improved code.\n\n${state.content}`, sink);
  return { ...state, newContent: result };
}

async function fixer(state) {
  state.res.write("\n[fixing bugs...]\n");
  const result = await ask(`Fix all bugs in this code. Return only the fixed code.\n\n${state.content}`, sink);
  return { ...state, newContent: result };
}

async function sender(state) {
  state.res.write("\n[saving file...]\n");
  const cleaned = state.newContent.replace(/```[\w]*\n?/g, "").trim();
  await axios.put(
    `http://localhost:3000/files/${state.fileId}`,
    { content: cleaned },
    { headers: { Authorization: `Bearer ${state.token}` } }
  );
  state.res.write("\n[file saved]\n");
  return state;
}

async function codeComparer(state) {
  state.res.write("\n[comparing changes...]\n");
  const result = await ask(`What changed between these two? Keep it under 20 words.

ORIGINAL:
${state.content}

UPDATED:
${state.newContent}`, state.res);
  return { ...state, response: result };
}

async function general(state) {
  state.res.write("\n[thinking...]\n");
  const result = await ask(state.content, sink);
  return { ...state, response: result };
}

const graph = new StateGraph({
  channels: {
    fileId: null,
    token: null,
    content: "",
    newContent: "",
    isCode: false,
    needs: "none",
    response: "",
    res: null,
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

async function response(fileId, content, token, res) {
  try {
    await app.invoke({
      fileId,
      token,
      content,
      newContent: content,
      isCode: false,
      needs: "none",
      response: "",
      res,
    });
  } catch (err) {
    console.error("[ERROR]", err);
    res.write("\n[something went wrong]\n");
  } finally {
    res.end();
  }
}

export default response;