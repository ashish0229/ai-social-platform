import { env } from "../../config/env.js";

export type AiModerationResult = {
  toxicity: number;
  hateSpeech: number;
  selfHarm: number;
  labels: string[];
};

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${env.AI_SERVICE_URL}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`AI service failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function fallbackModeration(content: string): AiModerationResult {
  const lower = content.toLowerCase();
  const redTerms = ["kill", "terror", "hate all", "self harm"];
  const yellowTerms = ["stupid", "idiot", "trash", "attack"];
  const red = redTerms.some((term) => lower.includes(term));
  const yellow = yellowTerms.some((term) => lower.includes(term));

  return {
    toxicity: red ? 0.86 : yellow ? 0.58 : 0.08,
    hateSpeech: lower.includes("hate all") ? 0.86 : 0.05,
    selfHarm: lower.includes("self harm") ? 0.9 : 0.03,
    labels: red ? ["red_flag"] : yellow ? ["yellow_flag"] : ["safe"]
  };
}

export async function detectIntent(input: string) {
  try {
    return await postJson<{ intent: string; confidence: number }>("/intent", { input });
  } catch {
    return { intent: "general_post", confidence: 0.6 };
  }
}

export async function generatePost(input: {
  topic: string;
  tone: string;
  platform: string;
  context: string;
}) {
  try {
    const result = await postJson<{ content: string }>("/generate", input);
    return result.content;
  } catch {
    return `${input.tone} post for ${input.platform}: ${input.topic}. ${input.context}`;
  }
}

export async function moderateContent(content: string) {
  try {
    return await postJson<AiModerationResult>("/moderate", { content });
  } catch {
    return fallbackModeration(content);
  }
}

