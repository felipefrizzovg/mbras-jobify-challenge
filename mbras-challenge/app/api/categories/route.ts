import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const res = await fetch("https://remotive.com/api/remote-jobs/categories")

  if (!res.ok) {
    return NextResponse.json({ error: "Não foi possível buscar categorias da Remotive" }, { status: 500 });
  }

  const data = await res.json();

  return NextResponse.json(data.jobs ?? []);
}