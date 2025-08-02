import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import jobsRouter from './routes/jobs';
import categoriesRouter from './routes/categories';
import favoritesRouter from './routes/favorites';

const app = express()
app.use(cors())
app.use(express.json());

app.use('/api/jobs', jobsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/favorites', favoritesRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})