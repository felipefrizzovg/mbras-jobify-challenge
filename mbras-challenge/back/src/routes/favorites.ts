import { createClient } from "@supabase/supabase-js";
import { Request, Response, Router } from "express";
import { Job } from "../../types/job";

const router = Router();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_PUBLISHABLE_OR_ANON_KEY!
)

// Pegar favoritos do usuário anônimo
router.get('/', async (req: Request, res: Response) => {
  const anonId = req.query.anon_id as string;
  if (!anonId) return res.status(400).json({ error: 'anon_id é obrigatório' });

  const { data: favorites, error } = await supabase.from('favorites').select("job_id").eq('anon_id', anonId);

  if (error) return res.status(500).json({ error: error.message })
  if (!favorites?.length) return res.json([]);

  const jobsResp = await fetch(`${process.env.API_URL}`);
  const jobsData = await jobsResp.json();
  const jobs: Job[] = jobsData.jobs || [];

  const favoriteJobs = jobs.filter(job => favorites.some(fav => fav.job_id === job.id));

  res.json(favoriteJobs);
})

// Adicionar favorito
router.post('/', async (req: Request, res: Response) => {
  const { anon_id, job_id } = req.body;
  if (!anon_id || !job_id) return res.status(400).json({ error: 'anon_id e job_id são obrigatórios' });

  const { error } = await supabase.from('favorites').insert([{ anon_id, job_id }])

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ ok: true });
})

// Remover favorito
router.delete('/', async (req: Request, res: Response) => {
  const { anon_id, job_id } = req.body
  if (!anon_id || !job_id) return res.status(400).json({ error: 'anon_id e job_id são obrigatórios' });

  const { error } = await supabase.from('favorites').delete().eq('anon_id', anon_id).eq('job_id', job_id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
})

export default router