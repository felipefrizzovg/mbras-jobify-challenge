"use client";

import { Job } from "@/types/job";

import { useEffect, useState } from "react";

import JobCard from "./JobCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function ClientFavoriteJobs() {
  const [favoriteJobs, setFavoriteJobs] = useState<Job[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  function getAnonId(): string | null {
    if (typeof window === "undefined") return null;

    return localStorage.getItem("anon_id");
  }

  useEffect(() => {
    async function fetchFavorites() {
      const anonId = getAnonId();

      if (!anonId) {
        setFavoriteJobs([]);

        setLoading(false);

        return;
      }

      try {
        setLoading(true);

        setError(null);

        const res = await fetch(
          `${API_URL}/api/favorites?anon_id=${encodeURIComponent(anonId)}`
        );

        if (!res.ok) {
          throw new Error("Erro ao buscar favorito");
        }

        const data: Job[] = await res.json();

        setFavoriteJobs(data);
      } catch (err) {
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, []);

  if (loading) {
    return <p className="py-4 text-center">Carregando vagas favoritas...</p>;
  }

  if (error) {
    return <p className="py-4 text-center text-red-600">Erro: {error}</p>;
  }

  if (favoriteJobs.length === 0) {
    return (
      <p className="py-4 text-center text-muted-foreground">
        Nenhuma vaga favoritada ainda.
      </p>
    );
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 px-4">Vagas favoritas</h2>

      <div className="lg:overflow-x-auto py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:space-x-4 gap-6">
          {favoriteJobs.map((job) => (
            <div key={job.id} className="flex-shrink-0 ">
              <JobCard job={job} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
