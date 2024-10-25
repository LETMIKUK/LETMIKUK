import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// export const runtime = "edge"; // Optional: Use edge runtime for better performance

// // Increase the maximum runtime duration
// export const maxDuration = 300; // 5 minutes, adjust as needed

// export async function POST(request: NextRequest) {
//   console.log("API request received");

//   try {
//     const body = await request.json();
//     console.log("API body:", body);

//     const { prompt } = body;
//     console.log("API prompt:", prompt);

//     // Create a controller for the fetch
//     // const controller = new AbortController();
//     // const timeoutId = setTimeout(() => {
//     //   controller.abort();
//     // }, 9 * 60 * 1000); // 9 minutes timeout

//     try {
//       const response = await fetch(
//         "https://nbdy1-zephyr-api-endpoint.hf.space/llm_on_cpu",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             // Add optional headers for HF space
//             Accept: "application/json",
//             Connection: "keep-alive",
//           },
//           body: JSON.stringify({
//             prompt: prompt,
//           }),
//           // Add longer fetch timeout
//           keepalive: true,
//           // Increase timeout duration
//           //   timeout: 540000, // 9 minutes in milliseconds
//         }
//       );

//       if (!response.ok) {
//         // Log the error response
//         const errorText = await response.text();
//         console.error("API error response:", {
//           status: response.status,
//           statusText: response.statusText,
//           body: errorText,
//         });

//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       console.log("API response received:", response.status);
//       const data = await response.json();
//       console.log("API data:", data);

//       return NextResponse.json(
//         { message: "OK", data },
//         {
//           status: 201,
//           headers: {
//             "Cache-Control": "no-store",
//           },
//         }
//       );
//     } catch (fetchError: any) {
//       console.error("Fetch error:", fetchError);

//       // Handle specific error types
//       if (fetchError.name === "AbortError") {
//         return NextResponse.json(
//           {
//             message: "Error",
//             error: "Request timeout",
//           },
//           { status: 504 }
//         );
//       }

//       throw fetchError; // Re-throw for outer catch block
//     }
//   } catch (error: any) {
//     console.error("API route error:", error);

//     // Return a structured error response
//     return NextResponse.json(
//       {
//         message: "Error",
//         error: {
//           type: error.name || "UnknownError",
//           message: error.message || "An unknown error occurred",
//           details: error.cause || error.toString(),
//         },
//       },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request: NextRequest) {
  const body = await request.json();
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [],
      temperature: 1,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: {
        type: "text",
      },
    });
    const result = await body;
    return NextResponse.json({ message: "OK", result }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
