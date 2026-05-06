// lib/claude.ts
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface BenchmarkInput {
  skills: string[];
  yearsExperience: number;
  domain: string;
  projectType: "hourly" | "fixed";
}

export interface BenchmarkResult {
  hourlyRate: { min: number; max: number; recommended: number };
  projectRate: { min: number; max: number };
  tier: string;
  justification: {
    summary: string;
    perSkill: { skill: string; marketDemand: string; premiumUSD: string }[];
  };
  comparables: string[];
}

const SYSTEM = `You are a senior technical recruiter and market analyst with deep knowledge of 
US freelance software development rates as of 2025. You specialise in India-to-US outsourcing 
market pricing. Always return accurate, realistic USD rates based on current Upwork, Toptal, 
and direct client market data. Return ONLY valid JSON. No preamble or explanation.`;

export async function benchmarkRate(input: BenchmarkInput): Promise<BenchmarkResult> {
  const prompt = `
Benchmark the freelance rate for this developer profile against the US market:

Skills: ${input.skills.join(", ")}
Years of Experience: ${input.yearsExperience}
Domain: ${input.domain}
Engagement Type: ${input.projectType}

Return a JSON object with exactly these keys:
{
  "hourlyRate": { "min": number, "max": number, "recommended": number },
  "projectRate": { "min": number, "max": number },
  "tier": "Junior" | "Mid-Level" | "Senior" | "Expert",
  "justification": {
    "summary": "2-3 sentence market analysis",
    "perSkill": [{ "skill": string, "marketDemand": string, "premiumUSD": string }]
  },
  "comparables": ["Platform avg: $X-Y/hr", ...]
}

Base rates on realistic 2025 US market data for Indian developers working remotely with US clients.
`;

  const res = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: SYSTEM,
    messages: [{ role: "user", content: prompt }],
  });

  const text = res.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("")
    .replace(/```json|```/g, "")
    .trim();

  return JSON.parse(text) as BenchmarkResult;
}
