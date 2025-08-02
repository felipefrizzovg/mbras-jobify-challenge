import { Job } from "@/types/job";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const anonId = request.nextUrl.searchParams.get("anon_id");

  if (!anonId) {
    return NextResponse.json(
      { error: "anon_id é obrigatório" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data: favorites, error: favError } = await supabase
    .from("favorites")
    .select("job_id")
    .eq("anon_id", anonId);

  if (favError) {
    return NextResponse.json({ error: favError.message }, { status: 500 });
  }

  if (!favorites?.length) {
    return NextResponse.json([]);
  }

  const res = await fetch("https://remotive.com/api/remote-jobs");
  if (!res.ok) {
    return NextResponse.json({ error: "Erro na Remotive" }, { status: 500 });
  }

  const data = await res.json();
  const jobs = data.jobs ?? [];

  const favoriteJobs = jobs.filter((job: Job) =>
    favorites.some(fav => fav.job_id === job.id)
  );

  return NextResponse.json(favoriteJobs)
}
