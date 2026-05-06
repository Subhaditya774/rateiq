// app/api/benchmark/route.ts
import { NextRequest, NextResponse } from "next/server";
import { benchmarkRate, BenchmarkInput } from "@/lib/claude";

export async function POST(req: NextRequest) {
  try {
    const body: BenchmarkInput = await req.json();

    if (!body.skills?.length || !body.yearsExperience || !body.domain) {
      return NextResponse.json(
        { error: "skills, yearsExperience, and domain are required" },
        { status: 400 }
      );
    }

    const result = await benchmarkRate(body);
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error("Benchmark error:", err);
    return NextResponse.json({ error: "Rate benchmark failed" }, { status: 500 });
  }
}
