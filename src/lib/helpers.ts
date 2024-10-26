import { OpenAI } from "openai";

export async function generateEmbedding({
  openai,
  text,
}: {
  openai: OpenAI;
  text: string;
}) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    return null; // Return null or handle as needed
  }
}
