import Error from "next/error";
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { generateEmbedding } from "@/lib/helpers";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { createClient } from "next-sanity";
import { UserState } from "@/lib/types/user";

function extractRelevantUserContext(userProfile: UserState): string {
  const { personalInfo, motherInfo } = userProfile;
  let context = `Nama user: ${personalInfo.fullName}`;

  if (personalInfo.role === "Mother" && motherInfo) {
    context += `, Sedang Hamil: ${motherInfo.isPregnant ? "Ya" : "Tidak"}`;

    if (motherInfo.isPregnant && motherInfo.pregnancyStartDate) {
      const pregnancyMonths =
        motherInfo.pregnancyMonths ||
        Math.floor(
          (new Date().getTime() - motherInfo.pregnancyStartDate.getTime()) /
            (1000 * 60 * 60 * 24 * 30)
        );
      context += `, Lama Kehamilan: ${pregnancyMonths} bulan`;
    }

    if (motherInfo.children.length > 0) {
      const childrenInfo = motherInfo.children
        .map((child) => {
          const ageMonths = Math.floor(
            (new Date().getTime() - child.birthDate.getTime()) /
              (1000 * 60 * 60 * 24 * 30)
          );
          return `${child.name} (${child.gender}), Umur: ${ageMonths} bulan${child.allergies ? `, Alergi: ${child.allergies}, Catatan Anak: ${child.notes}` : ""}`;
        })
        .join("; ");
      context += `, Anak-Anak: ${childrenInfo}`;
    }
  }

  return context;
}
// nutrition chat for app

export async function POST(request: NextRequest) {
  const json = await request.json();
  console.log("request body:", request.body);
  console.log("request json:", json);
  const { prompt, userProfile } = json;

  if (
    !process.env.SANITY_TOKEN ||
    !process.env.OPENAI_API_KEY ||
    !process.env.PINECONE_API_KEY
  ) {
    return NextResponse.json(
      {
        message: "Error",
        error:
          "Missing environment variables. We forgot to put them in production",
      },
      { status: 500 }
    );
  }

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

    const KlasifikasiSubtopik = z.object({
      overview: z.boolean(), // Overview umum tentang nutrisi
      kebutuhan: z.boolean(), // Informasi umum tentang kebutuhan asupan
      contoh_resep: z.object({
        ibu_hamil: z.number().min(0), // Untuk ibu hamil/menyusui
        balita_6_8: z.number().min(0), // Untuk anak 6-8 bulan
        balita_9_11: z.number().min(0), // Untuk anak 9-11 bulan
        balita_12_23: z.number().min(0), // Untuk anak 12-23 bulan
        balita_2_5: z.number().min(0), // Untuk anak 2-5 tahun
      }),
      nutrisi_ibu_hamil: z.boolean(), // Nutrisi khusus untuk ibu hamil/menyusui
      nutrisi_balita_6_8: z.boolean(), // Nutrisi khusus untuk anak 6-8 bulan
      nutrisi_balita_9_11: z.boolean(), // Nutrisi khusus untuk anak 9-11 bulan
      nutrisi_balita_12_23: z.boolean(), // Nutrisi khusus untuk anak 12-23 bulan
      nutrisi_balita_2_5: z.boolean(), // Nutrisi khusus untuk anak 2-5 tahun
    });

    type KlasifikasiSubtopik = z.infer<typeof KlasifikasiSubtopik>;

    const intentClassification = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Klasifikasikan niat pengguna berdasarkan subtopik berikut:
        1. Overview umum tentang nutrisi.
        2. Informasi umum tentang kebutuhan asupan.
        3. Contoh resep dengan jumlah yang diminta pengguna (0 jika tidak ada):
           - untuk ibu hamil atau menyusui
           - untuk anak berusia 6-8 bulan
           - untuk anak berusia 9-11 bulan
           - untuk anak berusia 12-23 bulan
           - untuk anak berusia 2-5 tahun.
        4. Nutrisi khusus:
           - untuk ibu hamil atau menyusui
           - untuk anak berusia 6-8 bulan
           - untuk anak berusia 9-11 bulan
           - untuk anak berusia 12-23 bulan
           - untuk anak berusia 2-5 tahun.

      Berikan jumlah contoh resep sebagai angka dan true/false untuk topik lainnya dalam format JSON yang ringkas.
`,
        },
        { role: "user", content: prompt },
      ],
      response_format: zodResponseFormat(KlasifikasiSubtopik, "subtopik"),
    });

    const intents: KlasifikasiSubtopik = intentClassification.choices[0].message
      .parsed as KlasifikasiSubtopik;

    console.log("intents:", intents);

    const intentToSubtopicMapping = {
      overview_nutrisi: ["overview", "tips"],
      kebutuhan_asupan: ["kebutuhan_asupan", "porsi_makan", "tips"],
      contoh_resep: ["resep", "makanan_tambahan"],
      ibu_hamil_menyusui: ["kelas_ibu_hamil", "tips"],
      nutrisi_balita: ["masalah_gizi", "makanan_tambahan", "tips"],
    };

    const selectedSubtopics = Object.keys(intents)
      .filter(
        (intent) =>
          intent in intents &&
          intents[intent as keyof KlasifikasiSubtopik] === true
      )
      .flatMap(
        (intent) =>
          intentToSubtopicMapping[
            intent as keyof typeof intentToSubtopicMapping
          ]
      );

    const uniqueSubtopics = [...new Set(selectedSubtopics)];

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
        filter: {
          subtopic: { $in: uniqueSubtopics },
        },
      });
    }

    console.log("Pinecone query response:", pineconeResponse);

    const top5Results = pineconeResponse?.matches?.slice(0, 6);

    const imageIds = top5Results
      ?.filter((result) => result?.metadata?.has_image)
      ?.flatMap((result) => result?.metadata?.image_reference);
    let imageDocs = [];

    if (imageIds && imageIds.length > 0) {
      const client = createClient({
        apiVersion,
        dataset,
        projectId,
        useCdn: true,
        token: process.env.SANITY_TOKEN,
      });

      // Sanity query to fetch images by IDs
      const imageQuery = `*[_type == "augmentImage" && id in $ids]{ id, image, description }`;
      imageDocs = await client.fetch(imageQuery, { ids: imageIds });
      console.log("Fetched imageDocs:", imageDocs);
    }

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

    const userAbout = extractRelevantUserContext(userProfile);
    console.log("userAbout:", userAbout);
    // Optionally filter or process the context chunks here if needed
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Kamu adalah asisten AI yang pintar dan amat ramah bernama 'LETMIKUK AI' (Layanan Edukasi Terkait Malnutrisi dan Intervensi Kesehatan Untuk Keluarga) yang membantu ibu-ibu di Indonesia menjaga kesehatan dan nutrisi mereka serta anak-anak mereka, terutama yang sedang hamil atau menyusui.
      Sapalah pengguna dan dengan ramah fokus untuk menjawab sesuai permintaan user sebisa mungkin menggunakan informasi dari konteks database tapi apabila konteks database tidak relevan untuk menjawab, abaikan dan gunakan pengetahuan umum anda sebagai AI. Saat menjawab melalui informasi konteks database, sebut juga sumber informasinya. Rata-rata sumber adalah dari ayosehat (program & kampanye kesehatan oleh kementerian kesehatan Indonesia). Biasanya kamu akan menjawab seperti memberikan informasi yang relevan tentang gizi ibu dan anak, tips perawatan kehamilan dan menyusui, contoh resep bergizi, serta panduan untuk memantau pertumbuhan anak agar terhindar dari stunting atau kekurangan gizi.
      Fokuslah pada edukasi yang dapat membantu anak-anak bertumbuh secara normal sesuai usia mereka, serta berikan saran-saran sederhana dan mudah dipraktikkan di rumah.
      Apabila disuruh memberi contoh resep, cukup sebutkan yang kami taruh di konteks database termasuk sumbernya, target konsumernya, dan deskripsi singkat atas apa yang perlu disiapkan untuk membuatnya. Untuk resep tidak usah kasih langkah-langkahnya karena sistem akan mengirim gambar resep dan bahan ke pengguna.`,
        },
        {
          role: "user",
          content: `${combinedContext ? `konteks latar belakang user: ${userAbout ? userAbout : "data latar belakang user kosong"}\n\nkonteks database: ${combinedContext}` : ""}\n\n${prompt}`, // Combine context with user prompt
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

    // Create a ReadableStream that first sends images and then streams text
    const readableStream = new ReadableStream({
      async start(controller) {
        // 1. Send initial image data as JSON
        const imageJSON = JSON.stringify({ images: imageDocs });
        controller.enqueue(encoder.encode(imageJSON + "\n\n"));

        // 2. Stream text content
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
      headers: { "Content-Type": "multipart/mixed; boundary=boundary" },
    });
    // return new NextResponse(readableStream, {
    //   headers: { "Content-Type": "text/event-stream" },
    // });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Error", error: "Unexpected error" },
      { status: 500 }
    );
  }
}
