import { ChatOllama } from "@langchain/ollama";

const model = new ChatOllama({
  model: "gemma2:2b",
});

const res = await model.invoke("Hello, explain AI simply 5 words");
console.log(res.content);
