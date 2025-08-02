import FavoriteButton from "@/components/FavoriteButton";
import { Job } from "@/types/job";
import Image from "next/image";
import { notFound } from "next/navigation";

async function getJob(id: string): Promise<Job | null> {
  const url = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/jobs/${id}`;

  const response = await fetch(url, { cache: "no-store" })
  if (!response.ok) return null;
  return response.json();
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const job = await getJob(resolvedParams.id);
  if (!job) return notFound();

  return (
    <main className="max-w-3xl py-8 px-4 mx-auto">
      <div className="flex items-start gap-4">
        <Image
          src={job.company_logo_url || job.company_logo}
          alt={job.company_name}
          width={80}
          height={80}
          className="w-20 h-20 object-contain rounded bg-muted shadow"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-1">{job.title}</h1>
          <p className="text-muted-foreground font-medium">{job.company_name}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="bg-muted px-2 py-0.5 rounded text-xs font-medium capitalize">{job.category}</span>
            <span className="bg-muted px-2 py-0.5 rounded text-xs font-medium capitalize">{job.candidate_required_location}</span>
            {job.salary && <span className="bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded text-xs ">{job.salary}</span>}
          </div>
        </div>
        <FavoriteButton jobId={job.id} />
      </div>

      {job.tags && job.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 my-4">
          {job.tags.map(tag => (
            <span key={tag} className="border border-muted rounded px-2 py-0.5 text-xs bg-accent">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center mt-2 mb-4">
        <span className="text-xs text-muted-foreground">
          Publicada: {new Date(job.publication_date).toLocaleDateString("pt-BR")}
        </span>
        <a 
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Abrir vaga ${job.title} no site oficial da Remotive`}
          className="text-primary font-semibold underline"
        >
          Ver vaga original
        </a>
      </div>

      <div 
        className="prose prose-neutral max-w-full"
        dangerouslySetInnerHTML={{ __html: job.description }}
      />
    </main>
  )
}