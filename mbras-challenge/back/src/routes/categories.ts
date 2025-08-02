import { Request, Response, Router } from "express";

const router = Router();

// GET api/categories
router.get('/', async (_req: Request, res: Response) => {
  try {
    const response = await fetch(`${process.env.API_URL}/categories`);
    if (!response.ok) {
      return res.status(500).json({ error: 'Erro ao buscar categorias da Remotive'});
    }

    const data = await response.json();
    res.json(data.jobs ?? []);
  } catch (error) {
    res.status(500).json({ error: 'Erro inesperado ao buscar categorias' });
  }
})

export default router;