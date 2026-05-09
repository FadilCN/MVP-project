import ollama from "ollama";

async function response(content) {
  const res = await ollama.generate({
    model: "gemma2:2b",
    prompt: content,
  });

  return { content: res.response };
}

export default response;