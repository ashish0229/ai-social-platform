from typing import List

from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="AI Social Moderation Service")


class IntentRequest(BaseModel):
    input: str = Field(min_length=1)


class IntentResponse(BaseModel):
    intent: str
    confidence: float


class GenerateRequest(BaseModel):
    topic: str
    tone: str
    platform: str
    context: str


class GenerateResponse(BaseModel):
    content: str


class ModerateRequest(BaseModel):
    content: str = Field(min_length=1)


class ModerateResponse(BaseModel):
    toxicity: float
    hateSpeech: float
    selfHarm: float
    labels: List[str]


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/intent", response_model=IntentResponse)
def detect_intent(payload: IntentRequest):
    text = payload.input.lower()
    if "launch" in text or "announce" in text:
        return {"intent": "announcement", "confidence": 0.86}
    if "sell" in text or "discount" in text:
        return {"intent": "promotion", "confidence": 0.82}
    if "help" in text or "support" in text:
        return {"intent": "support_request", "confidence": 0.78}
    return {"intent": "general_post", "confidence": 0.64}


@app.post("/generate", response_model=GenerateResponse)
def generate_post(payload: GenerateRequest):
    content = (
        f"{payload.topic}\n\n"
        f"Here is a {payload.tone.lower()} update crafted for {payload.platform}: "
        f"{payload.context.strip()}\n\n"
        "Built with clarity, relevance, and community safety in mind."
    )
    return {"content": content}


@app.post("/moderate", response_model=ModerateResponse)
def moderate(payload: ModerateRequest):
    text = payload.content.lower()

    red_terms = ["kill", "terror", "hate all", "self harm", "suicide instructions"]
    yellow_terms = ["idiot", "stupid", "trash", "attack", "harass"]

    red_hit = any(term in text for term in red_terms)
    yellow_hit = any(term in text for term in yellow_terms)
    hate_hit = "hate all" in text
    self_harm_hit = "self harm" in text or "suicide instructions" in text

    toxicity = 0.88 if red_hit else 0.58 if yellow_hit else 0.08
    hate_speech = 0.86 if hate_hit else 0.04
    self_harm = 0.9 if self_harm_hit else 0.03

    labels = ["safe"]
    if red_hit:
        labels = ["red_flag"]
    elif yellow_hit:
        labels = ["yellow_flag"]

    return {
        "toxicity": toxicity,
        "hateSpeech": hate_speech,
        "selfHarm": self_harm,
        "labels": labels,
    }

