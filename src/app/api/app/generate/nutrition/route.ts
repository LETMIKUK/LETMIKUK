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
        ibu_hamil: z.number(), // Untuk ibu hamil/menyusui
        balita_6_8_bulan: z.number(), // Untuk anak 6-8 bulan
        balita_9_11_bulan: z.number(), // Untuk anak 9-11 bulan
        balita_12_23_bulan: z.number(), // Untuk anak 12-23 bulan
        balita_2_5_tahun: z.number(), // Untuk anak 2-5 tahun
      }),
      nutrisi_ibu_hamil: z.boolean(), // Nutrisi khusus untuk ibu hamil/menyusui
      nutrisi_balita_6_8_bulan: z.boolean(), // Nutrisi khusus untuk anak 6-8 bulan
      nutrisi_balita_9_11_bulan: z.boolean(), // Nutrisi khusus untuk anak 9-11 bulan
      nutrisi_balita_12_23_bulan: z.boolean(), // Nutrisi khusus untuk anak 12-23 bulan
      nutrisi_balita_2_5_tahun: z.boolean(), // Nutrisi khusus untuk anak 2-5 tahun
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

    // Mapping to match intents with vector subtopics
    const intentToSubtopicMapping = {
      overview: ["overview", "tips"],
      kebutuhan: ["kebutuhan_asupan", "porsi_makan", "tips"],
      nutrisi_ibu_hamil: ["kelas_ibu_hamil", "tips"],
      nutrisi_balita_6_8: ["masalah_gizi", "makanan_tambahan", "tips"],
      nutrisi_balita_9_11: ["masalah_gizi", "makanan_tambahan", "tips"],
      nutrisi_balita_12_23: ["masalah_gizi", "makanan_tambahan", "tips"],
      nutrisi_balita_2_5: ["masalah_gizi", "makanan_tambahan", "tips"],
    };

    // Sub-intents for recipe categories
    const recipeIntents = [
      { key: "ibu_hamil", label: "ibu_hamil" },
      { key: "balita_6_8_bulan", label: "balita_6_8_bulan" },
      { key: "balita_9_11_bulan", label: "balita_9_11_bulan" },
      { key: "balita_12_23_bulan", label: "balita_12_23_bulan" },
      { key: "balita_2_5_tahun", label: "balita_2_5_tahun" },
    ];

    // Step 1: Collect necessary recipe categories and quantities
    const recipeQueries = recipeIntents
      .map((intent) => ({
        label: intent.label,
        count:
          intents.contoh_resep[
            intent.key as keyof typeof intents.contoh_resep
          ] || 0,
      }))
      .filter((query) => query.count > 0); // Only keep recipe types with non-zero counts

    console.log("recipeQueries:", recipeQueries);
    // Generate embedding
    const queryEmbedding = await generateEmbedding({
      openai: openai,
      text: prompt,
    });

    const indexName = "rag-test";
    const index = pc.index(indexName);

    let rawRecipeResults: any[] = [];
    let rawAdditionalResults: any[] = [];

    // Step 1: Retrieve recipes first
    const recipeResults = [];
    if (queryEmbedding && recipeQueries.length > 0) {
      for (const query of recipeQueries) {
        const response = await index.query({
          vector: queryEmbedding,
          topK: query.count,
          includeMetadata: true,
          filter: {
            recipe_consumer: { $eq: query.label },
          },
        });
        console.log("pinecone recipe response:", response);
        rawRecipeResults.push(...response.matches);
        console.log("...response.matches push:", ...response.matches);
        recipeResults.push(
          ...response.matches.map((match: any) => {
            const { text, recipe_consumer, recipe_portion, source } =
              match.metadata;
            return `Resep untuk ${recipe_consumer} ${recipe_portion ? `(Porsi: ${recipe_portion})` : ""}:
    Sumber: ${source}
    ${text && recipeQueries.length <= 1 ? `Detail: ${text}` : ""}`;
          })
        );
      }
    }

    console.log("recipeResults:", recipeResults);
    // Step 2: Collect remaining subtopics based on non-recipe intents
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

    // Make the list unique, then exclude recipe subtopics to avoid duplication
    const uniqueSubtopics = [...new Set(selectedSubtopics)].filter(
      (subtopic) => !recipeQueries.some((r) => r.label === subtopic)
    );

    console.log("uniqueSubtopics:", uniqueSubtopics);

    // Step 2: Query for additional nutritional information
    let additionalResults: any = [];
    if (queryEmbedding && uniqueSubtopics.length > 0) {
      const additionalResponse = await index.query({
        vector: queryEmbedding,
        topK: 5,
        includeMetadata: true,
        filter: {
          subtopic: { $in: uniqueSubtopics },
        },
      });
      console.log("pinecone additional results response:", additionalResponse);
      rawAdditionalResults.push(...additionalResponse.matches);

      // Format and push each additional result
      additionalResults = additionalResponse.matches.map((match: any) => {
        const { text, subtopic, source } = match.metadata;
        return `Topik: ${subtopic}
Sumber: ${source}
Detail: ${text}`;
      });
    }
    console.log("additionalResults:", additionalResults);

    // Combine recipe and additional information results for the response
    const pineconeResponse: any = [...recipeResults, ...additionalResults];
    const rawResponse: any = [...rawRecipeResults, ...rawAdditionalResults];

    console.log("Pinecone query response:", pineconeResponse);
    console.log("raw response:", rawResponse);

    const imageIds = rawResponse
      .filter((result: any) => result?.metadata?.has_image)
      .flatMap((result: any) => result?.metadata?.image_reference)
      .slice(0, 10); // Limit to 10 images

    console.log("imageIds:", imageIds);

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
      const imageQuery = `*[_type == "augmentImage" && id in $ids]{ id, image, description, imageType }`;
      imageDocs = await client.fetch(imageQuery, { ids: imageIds });
      console.log("Fetched imageDocs:", imageDocs);
    }

    // Extract the relevant chunks
    // Build context chunks for the LLM
    const contextChunks = pineconeResponse;

    // Join the context chunks into a single string
    let combinedContext = contextChunks?.join("\n\n");

    // Truncate context if it exceeds a certain length
    const maxContextLength = 1000; // Set a suitable limit based on token count
    if (combinedContext && combinedContext.length > maxContextLength) {
      combinedContext = combinedContext.slice(0, maxContextLength) + "..."; // Truncate and add ellipsis
    }

    console.log("combinedContext:", combinedContext);
    if (!combinedContext) {
      console.log("no context retrieved");
    }

    const userAbout = extractRelevantUserContext(userProfile);
    console.log("userAbout:", userAbout);
    // Optionally filter or process the context chunks here if needed
    function generateSystemPrompt(intent: KlasifikasiSubtopik) {
      const instructions = [
        "Kamu adalah asisten AI yang pintar dan amat ramah bernama 'LETMIKUK AI' (Layanan Edukasi Terkait Malnutrisi dan Intervensi Kesehatan Untuk Keluarga) yang membantu ibu-ibu di Indonesia menjaga kesehatan dan nutrisi mereka serta anak-anak mereka, terutama yang sedang hamil atau menyusui.",
      ];

      if (intent.overview) {
        instructions.push(
          "Berikan overview umum mengenai nutrisi yang relevan untuk pengguna."
        );
      }

      if (intent.kebutuhan) {
        instructions.push(
          "Sampaikan informasi kebutuhan asupan nutrisi yang sesuai dengan kebutuhan pengguna."
        );
      }

      if (intent.contoh_resep) {
        const resepTypes = [
          { key: "ibu_hamil", label: "untuk ibu hamil/menyusui" },
          { key: "balita_6_8", label: "untuk anak usia 6-8 bulan" },
          { key: "balita_9_11", label: "untuk anak usia 9-11 bulan" },
          { key: "balita_12_23", label: "untuk anak usia 12-23 bulan" },
          { key: "balita_2_5", label: "untuk anak usia 2-5 tahun" },
        ];

        const resepInstructions = resepTypes
          .filter(
            ({ key }) =>
              intent.contoh_resep[key as keyof typeof intent.contoh_resep] > 0
          )
          .map(
            ({ key, label }) =>
              `Berikan ${intent.contoh_resep[key as keyof typeof intent.contoh_resep]} contoh resep ${label}.`
          );

        if (resepInstructions.length > 0) {
          instructions.push(...resepInstructions);
        }
      }

      const nutrisiTypes = [
        { key: "nutrisi_ibu_hamil", label: "ibu hamil/menyusui" },
        { key: "nutrisi_balita_6_8", label: "anak usia 6-8 bulan" },
        { key: "nutrisi_balita_9_11", label: "anak usia 9-11 bulan" },
        { key: "nutrisi_balita_12_23", label: "anak usia 12-23 bulan" },
        { key: "nutrisi_balita_2_5", label: "anak usia 2-5 tahun" },
      ];

      const nutrisiInstructions = nutrisiTypes
        .filter(({ key }) => intent[key as keyof typeof intent] === true)
        .map(({ label }) => `Berikan informasi nutrisi khusus untuk ${label}.`);

      if (nutrisiInstructions.length > 0) {
        instructions.push(...nutrisiInstructions);
      }

      instructions.push(
        "Sertakan sumber informasi dari database jika ada, dan apabila konteks database tidak relevan untuk menjawab, abaikan dan gunakan pengetahuan umum anda sebagai AI."
      );

      return instructions.join(" ");
    }

    // Generate system prompt conditionally
    const systemPrompt = generateSystemPrompt(intents);

    console.log("systemPrompt:", systemPrompt);

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `${userAbout ? `konteks latar belakang user: ${userAbout}\n\n` : ""}${combinedContext ? `konteks database: ${combinedContext}\n\n` : ""}${prompt}`, // Combine context with user prompt
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
