async function getJobs(category?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  let url = `${baseUrl}/api/jobs`;

  if (category) {
    url += `?category=${encodeURIComponent(category)}`;
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Erro ao buscar vagas');
  }
  return res.json();
}

export default async function JobsListPage({ searchParams }: { searchParams: { category?: string } }) {
  const { category } = searchParams;
  const jobs = await getJobs(category);

  return (
    <div>
      <h1>Vagas de emprego</h1>
      <ul className="flex gap-4 flex-col">
        {jobs.map((job: any) => (
          <li key={job.id}>
            <strong>{job.title}</strong>
            <p>{job.company_name}</p>
            <span>{job.category}</span>
            <a href={job.url} target="_blank" className="block">Link da vaga</a>
          </li>
        ))}
      </ul>
    </div>
  )
}