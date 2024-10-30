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

    const stream = await openai.chat.completions.create({
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
      stream: true,
    });

    console.log("response id:", stream._request_id);

    let fullResponse = "";
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (chunk.choices[0].delta.content) {
            const partialContent = chunk.choices?.[0]?.delta?.content || "";
            console.log("chunk:", chunk.choices[0].delta.content);
            const queue = encoder.encode(partialContent);
            console.log("queue:", queue);
            fullResponse = fullResponse + partialContent;
            controller.enqueue(queue);
          }
        }
        controller.close();
        console.log("fullResponse:", fullResponse);
      },
    });
    console.log("fullResponse:", fullResponse);

    return new NextResponse(readableStream, {
      headers: { "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Error", error: "Unexpected error" },
      { status: 500 }
    );
  }
}
