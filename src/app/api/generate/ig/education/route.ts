import Error from "next/error";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

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
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Kamu adalah asisten AI profesional yang bertugas membuat konten Instagram tentang stunting dan kesehatan anak dalam Bahasa Indonesia.
          ATURAN PENTING:
          1. Selalu gunakan Bahasa Indonesia yang baik dan benar
          2. Selalu berikan respons dalam format berikut:
          Judul: {judul singkat dan menarik}
          Isi: {isi konten informatif}
          BATASAN KONTEN:
          - Judul: maksimal 15 kata, menarik dan to the point
          - Isi: maksimal 200 kata, informatif dan mudah dipahami
          - Tone: informatif namun tetap ramah dan mudah dicerna
          Pengguna akan memberikan kata kunci terkait stunting atau kesehatan anak, dan kamu harus mengembangkannya menjadi konten Instagram yang menarik sesuai format di atas.`,
        },
        {
          role: "user",
          content: `kata kunci: ${prompt}`,
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
