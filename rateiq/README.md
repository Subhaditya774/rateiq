# RateIQ — AI-Powered Freelance Rate Benchmarker

> Input your skills and experience. Get a US-market-benchmarked hourly/project rate with a structured Claude-powered justification.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square)
![Claude API](https://img.shields.io/badge/Anthropic-Claude_API-orange?style=flat-square)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square)

---

## What It Does

RateIQ helps Indian software developers and freelancers understand what to charge US clients. You input:

- Your skill stack (React, Node.js, Python, AI/ML, etc.)
- Years of experience
- Project type (fixed / hourly)
- Domain (web, mobile, AI/ML, DevOps, etc.)

Claude benchmarks your profile against US market data and returns:

- Recommended hourly rate (USD)
- Recommended project rate range
- Tier classification (Junior / Mid / Senior / Expert)
- Justification with reasoning per skill
- Exportable PDF report

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| AI | Anthropic Claude API |
| Database | PostgreSQL (rate history, user profiles) |
| Export | PDF generation via reportlab / Puppeteer |
| Deployment | Vercel |

## Getting Started

```bash
git clone https://github.com/Subhaditya774/rateiq.git
cd rateiq
npm install
cp .env.example .env.local
npm run dev
```

## API Usage

```bash
curl -X POST http://localhost:3000/api/benchmark \
  -H "Content-Type: application/json" \
  -d '{
    "skills": ["React", "Next.js", "TypeScript", "PostgreSQL"],
    "yearsExperience": 2,
    "domain": "fullstack",
    "projectType": "hourly"
  }'
```

Response:
```json
{
  "hourlyRate": { "min": 35, "max": 55, "recommended": 42 },
  "projectRate": { "min": 5000, "max": 15000 },
  "tier": "Mid-Level",
  "justification": {
    "summary": "Your React + TypeScript stack is in strong demand in the US market...",
    "perSkill": [
      { "skill": "React", "marketDemand": "Very High", "premiumUSD": "+$8/hr" },
      { "skill": "Next.js", "marketDemand": "High", "premiumUSD": "+$5/hr" }
    ]
  },
  "comparables": ["Upwork avg: $35-50/hr", "Toptal avg: $60-90/hr"]
}
```

## Project Structure

```
rateiq/
├── app/
│   ├── api/
│   │   └── benchmark/    # Claude-powered rate calculation
│   └── result/           # Rate results page
├── lib/
│   ├── claude.ts         # Prompt + response parser
│   └── pdf.ts            # PDF report generator
└── components/
    ├── SkillSelector.tsx  # Multi-select skill picker
    └── RateCard.tsx       # Results display
```

## License

MIT
