import { Router, Request, Response } from "express";
import fetch from 'node-fetch';
import { Job } from "../../types/job";

const router = Router();

// GET api/jobs
router.get("/", async (req: Request, res: Response) => {
  const { category, search } = req.query;
  let url = "https://remotive.com/api/remote-jobs"
  const params: string[] = [];

  if (category) params.push(`category=${encodeURIComponent(String(category))}`);
  if (search) params.push(`search=${encodeURIComponent(String(search))}`);
  if (params.length > 0) {
    url += `?${params.join("&")}`;
  }

  try {
    const response = await fetch(url)
    const data = await response.json();
    res.json(data.jobs || data);
  } catch {
    res.status(500).json({ error: "Erro ao buscar vagas" })
  }
})

// GET api/jobs/:id
router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const response = await fetch(`https://remotive.com/api/remote-jobs/`);
  const data = await response.json();
  const jobs: Job[] = data.jobs || [];

  const job = jobs.find((job) => job.id.toString() === id)
  if (!job) return res.status(404).json({ error: "Vaga não encontrada" });
  res.json(job);
})

export default router;