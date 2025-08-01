import { Job } from '@/types/job';
import { NextRequest, NextResponse } from 'next/server';

type Params = {
  id: string;
};

type JobsResponse = { jobs: Job[] };

export async function GET(request: NextRequest, { params }: { params: Promise<Params> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const res = await fetch(`https://remotive.com/api/remote-jobs`);
  if (!res.ok) {
    return NextResponse.json({ error: 'Vaga não encontrada' }, { status: 404 });
  }
  const data: JobsResponse = await res.json();
  const jobs = data.jobs || [];

  const job = jobs.find((item: Job) => item.id.toString() === id);

  if (!job) {
    return NextResponse.json({ error: 'Vaga não encontrada' }, { status: 404 });
  }

  return NextResponse.json(job);
}
