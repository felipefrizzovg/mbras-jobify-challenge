import { NextRequest, NextResponse } from 'next/server';

type Params = { id: string };

export async function GET(request: NextRequest, { params }: { params: Params }) {
  const { id } = params;
  const res = await fetch(`https://remotive.com/api/remote-jobs/${id}`);
  if (!res.ok) {
    return NextResponse.json({ error: 'Vaga não encontrada' }, { status: 404 });
  }
  const data = await res.json();
  return NextResponse.json(data);
}
