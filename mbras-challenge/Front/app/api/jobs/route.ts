import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  let url = 'https://remotive.com/api/remote-jobs';
  const params = []

  if (category) {
    params.push(`category=${encodeURIComponent(category)}`);
  }

  if (search) {
    params.push(`search=${encodeURIComponent(search)}`);
  }

  if (params.length) {
    url += '?' + params.join('&');
  }

  const fetchRes = await fetch(url)

  if (!fetchRes.ok) {
    return NextResponse.json({ error: 'Erro ao buscar vagas da Remotive' }, { status: 500 })
  }

  const data = await fetchRes.json();

  return NextResponse.json(data.jobs ?? data)
}