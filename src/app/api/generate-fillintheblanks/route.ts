import { z } from "zod";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";

// Define the schema for a fill-in-the-blanks question
const fillInTheBlanksQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()),
  answer: z.string()
});

const fillInTheBlanksQuestionsSchema = z.array(fillInTheBlanksQuestionSchema);

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { files } = await req.json();
    const firstFile = files[0].data;

    const result = streamObject({
      model: google("gemini-1.5-pro-latest"),
      messages: [
        {
          role: "system",
          content:
            "You are a teacher. Your job is to take a document and create 5 fill-in-the-blanks questions based on the content. Each question should have a sentence with two missing words, and provide 8 word options to choose from. The answer should be the two correct words that complete the sentence.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Create fill-in-the-blanks questions based on this document. Each question should have two blanks and 8 word options.",
            },
            {
              type: "file",
              data: firstFile,
              mimeType: "application/pdf",
            },
          ],
        },
      ],
      schema: fillInTheBlanksQuestionsSchema,
      onFinish: ({ object }) => {
        const res = fillInTheBlanksQuestionsSchema.safeParse(object);
        if (res.error) {
          throw new Error(res.error.errors.map((e) => e.message).join("\n"));
        }
      },
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || "Unknown error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
} 