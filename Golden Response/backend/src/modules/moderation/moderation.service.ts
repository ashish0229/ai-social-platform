import fs from "node:fs";
import path from "node:path";
import { FlagSeverity, PostStatus } from "@prisma/client";
import { detectIntent, generatePost, moderateContent } from "./aiModeration.client.js";

type Rule = {
  name: string;
  yellowThreshold: number;
  redThreshold: number;
  yellowAction: string;
  redAction: string;
};

type ModerationDecision = {
  status: PostStatus;
  flagSeverity: FlagSeverity;
  toxicityScore: number;
  rejectionReason?: string;
  appliedRule: string;
  action: string;
};

const rulesPath = path.join(process.cwd(), "src", "rules", "moderation_rules.json");
const rules = JSON.parse(fs.readFileSync(rulesPath, "utf8")) as Rule[];

function scoreForRule(ruleName: string, scores: { toxicity: number; hateSpeech: number; selfHarm: number }) {
  if (ruleName === "hate_speech") return scores.hateSpeech;
  if (ruleName === "self_harm") return scores.selfHarm;
  return scores.toxicity;
}

export async function classifyAndModerate(content: string): Promise<ModerationDecision> {
  const scores = await moderateContent(content);

  let selectedRule = rules[0];
  let selectedScore = 0;

  for (const rule of rules) {
    const score = scoreForRule(rule.name, scores);
    if (score > selectedScore) {
      selectedRule = rule;
      selectedScore = score;
    }
  }

  if (selectedScore >= selectedRule.redThreshold) {
    return {
      status: "REJECTED",
      flagSeverity: "RED",
      toxicityScore: selectedScore,
      rejectionReason: `${selectedRule.name} score exceeded red threshold`,
      appliedRule: selectedRule.name,
      action: selectedRule.redAction
    };
  }

  if (selectedScore >= selectedRule.yellowThreshold) {
    return {
      status: "QUARANTINED",
      flagSeverity: "YELLOW",
      toxicityScore: selectedScore,
      appliedRule: selectedRule.name,
      action: selectedRule.yellowAction
    };
  }

  return {
    status: "PUBLISHED",
    flagSeverity: "NONE",
    toxicityScore: selectedScore,
    appliedRule: selectedRule.name,
    action: "publish_post"
  };
}

export async function generateAndModerate(input: {
  topic: string;
  tone: string;
  platform: string;
  context: string;
}) {
  const intent = await detectIntent(`${input.topic} ${input.context}`);
  const content = await generatePost(input);
  const moderation = await classifyAndModerate(content);

  return {
    intent,
    content,
    moderation
  };
}

