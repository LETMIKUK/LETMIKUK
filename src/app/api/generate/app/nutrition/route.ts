import Error from "next/error";
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { generateEmbedding } from "@/lib/helpers";

// nutrition chat for app

export async function POST(request: NextRequest) {
  const json = await request.json();
  console.log("request body:", request.body);
  console.log("request json:", json);
  const { prompt } = json;

  console.log("prompt:", prompt);

  if (!prompt) {
    return NextResponse.json(
      { message: "Error", error: "No user prompt was included" },
      { status: 200 }
    );
  }

  try {
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY as string,
    });

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Retrieve relevant context from Pinecone
    const indexName = "rag-test"; // Make sure this is your index name
    const index = pc.Index(indexName);
    const queryEmbedding = await generateEmbedding({
      openai: openai,
      text: prompt,
    }); // Assuming you have a function to generate embeddings

    let pineconeResponse;
    if (queryEmbedding) {
      pineconeResponse = await index.query({
        vector: queryEmbedding,
        topK: 5, // Number of relevant items to retrieve
        includeMetadata: true,
      });
    }

    console.log("Pinecone query response:", pineconeResponse);

    // Extract relevant context
    const contextItems = pineconeResponse?.matches?.map(
      (match) => match.metadata
    );
    console.log("Retrieved context items:", contextItems);

    // Create context string to append to the prompt
    const contextString = contextItems
      ? contextItems
          .map(
            (item) =>
              `Nama: ${item?.name}, Deskripsi: ${item?.description}, Nilai Gizi: ${JSON.stringify(item?.nutritional_value)}`
          )
          .join("\n")
      : "";

    console.log("Context string:", contextString);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Kamu adalah asisten AI yang bertugas menyusun rencana makan sehat untuk anak-anak Indonesia. 
          Buatlah rencana yang mencakup sarapan, makan siang, dan makan malam. 
          Pertimbangkan nilai gizi dan anggaran yang terjangkau untuk keluarga Indonesia. 
          Gunakan bahan makanan umum dari database, terutama yang tinggi protein dan serat untuk mendukung pertumbuhan anak.`,
        },
        {
          role: "user",
          content: `${contextString}\n\n${prompt}`, // Combine context with user prompt
        },
      ],
      temperature: 1,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    console.log("response:", response);
    // Access only the content from the response
    const content = response.choices[0]?.message?.content || "";
    console.log("content:", content);
    // Check if choiceContent is empty or unexpected and add an error flag
    const isContentEmpty = !content;

    return NextResponse.json(
      {
        message: isContentEmpty ? "Content generation failed" : "OK",
        data: isContentEmpty ? null : content,
        error: isContentEmpty ? "No content generated" : null,
      },
      { status: isContentEmpty ? 200 : 200 }
    );
  } catch (error: any) {
    console.error("Error:", error); // Log the error for debugging
    return NextResponse.json(
      { message: "Error", error: error?.message },
      { status: 500 }
    );
  }
}
