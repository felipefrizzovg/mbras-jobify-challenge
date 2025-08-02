import ClientJobsGrid from "@/components/ClientJobsGrid";
import Header from "@/components/Header";
import { Category } from "@/types/category";
import { Job } from "@/types/job";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function getJobs(category: string = ""): Promise<Job[]> {
  let url = `${API_URL}/api/jobs`;
  if (category) url += `?category=${encodeURIComponent(category)}`;

  const response = await fetch(url, { cache: "no-store" })

  if (!response.ok) {
    throw new Error("Erro ao buscar vagas");
  }

  return response.json();
}

async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/api/categories`, {cache: "no-store",})

  if (!res.ok) {
    throw new Error("Erro ao buscar categorias");
  }
  return res.json();
}

export default async function Home({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = await searchParams;
  const category = params.category || "";
  
  const [jobs, categories] = await Promise.all([getJobs(category), getCategories()]);

  return (
    <>
      <Header />
      <main className="px-4">
        <ClientJobsGrid jobs={jobs} categories={categories} initialCategory={category} />
      </main>
    </>
  );
}
