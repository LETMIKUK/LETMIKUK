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

    // Extract the relevant chunks
    const contextChunks = pineconeResponse?.matches?.map(
      (match) => match?.metadata?.text
    );

    console.log("contextChunks:", contextChunks);

    // Combine the context chunks into a single string
    let combinedContext = contextChunks?.join("\n\n");

    // Truncate context if it exceeds a certain length
    const maxContextLength = 1000; // Set a suitable limit based on token count
    if (combinedContext && combinedContext?.length > maxContextLength) {
      combinedContext = combinedContext?.slice(0, maxContextLength) + "..."; // Truncate and add ellipsis
    }

    console.log("combinedContext:", combinedContext);
    if (!combinedContext) {
      console.log("no context retrieved");
    }
    // Optionally filter or process the context chunks here if needed
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Kamu adalah asisten AI bernama 'LETMIKUK AI' (Layanan Edukasi Terkait Malnutrisi dan Intervensi Kesehatan Untuk Keluarga) yang membantu ibu-ibu di Indonesia menjaga kesehatan dan nutrisi mereka serta anak-anak mereka, terutama yang sedang hamil atau menyusui. 
      Berikan informasi yang relevan tentang gizi ibu dan anak, tips perawatan kehamilan dan menyusui, contoh resep bergizi, serta panduan untuk memantau pertumbuhan anak agar terhindar dari stunting atau kekurangan gizi. 
      Fokuslah pada edukasi yang dapat membantu anak-anak bertumbuh secara normal sesuai usia mereka, serta berikan saran-saran sederhana dan mudah dipraktikkan di rumah.
      Tolak pertanyaan yang tidak terkait dengan kesehatan ibu atau anak.`,
        },
        {
          role: "user",
          content: `${combinedContext ? `konteks: ${combinedContext}` : ""}\n\n${prompt}`, // Combine context with user prompt
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
            const queue = encoder.encode(partialContent);
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
