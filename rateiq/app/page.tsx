"use client";
// app/page.tsx
import { useState } from "react";

const SKILL_OPTIONS = [
  "React", "Next.js", "TypeScript", "JavaScript", "Node.js", "Express",
  "Python", "FastAPI", "PostgreSQL", "MongoDB", "Claude API", "OpenAI API",
  "LangChain", "Docker", "AWS", "Tailwind CSS", "GraphQL", "Java", "DevOps",
];

const DOMAINS = ["fullstack", "frontend", "backend", "ai-ml", "devops", "mobile", "data-engineering"];

export default function Home() {
  const [skills, setSkills]   = useState<string[]>([]);
  const [years, setYears]     = useState(1);
  const [domain, setDomain]   = useState("fullstack");
  const [type, setType]       = useState<"hourly" | "fixed">("hourly");
  const [result, setResult]   = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const toggleSkill = (s: string) =>
    setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handleSubmit = async () => {
    if (!skills.length) { setError("Select at least one skill"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/benchmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills, yearsExperience: years, domain, projectType: type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-1">RateIQ</h1>
        <p className="text-slate-500 mb-8">Know your worth in the US market — AI-powered rate benchmarking</p>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
          {/* Skills */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Your Skills</label>
            <div className="flex flex-wrap gap-2">
              {SKILL_OPTIONS.map(s => (
                <button key={s} onClick={() => toggleSkill(s)}
                  className={`px-3 py-1 rounded-full text-sm border transition ${skills.includes(s) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Years */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Years of Experience: {years}</label>
            <input type="range" min={0} max={15} value={years} onChange={e => setYears(+e.target.value)}
              className="w-full accent-blue-600" />
            <div className="flex justify-between text-xs text-slate-400 mt-1"><span>0</span><span>15+</span></div>
          </div>

          {/* Domain + Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Domain</label>
              <select value={domain} onChange={e => setDomain(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm">
                {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Engagement</label>
              <select value={type} onChange={e => setType(e.target.value as any)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm">
                <option value="hourly">Hourly</option>
                <option value="fixed">Fixed Project</option>
              </select>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition">
            {loading ? "Benchmarking..." : "Get My Rate →"}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-6 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Your Rate</h2>
              <span className="bg-blue-50 text-blue-700 font-semibold text-sm px-3 py-1 rounded-full">{result.tier}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">${result.hourlyRate?.recommended}/hr</div>
                <div className="text-sm text-slate-500">Recommended</div>
                <div className="text-xs text-slate-400">${result.hourlyRate?.min}–${result.hourlyRate?.max} range</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">${(result.projectRate?.min/1000).toFixed(0)}k–${(result.projectRate?.max/1000).toFixed(0)}k</div>
                <div className="text-sm text-slate-500">Project Rate (USD)</div>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-3">{result.justification?.summary}</p>
            <div className="space-y-1">
              {result.justification?.perSkill?.map((s: any) => (
                <div key={s.skill} className="flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{s.skill}</span>
                  <span className="text-green-600 font-semibold">{s.premiumUSD}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
