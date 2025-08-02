"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Job } from "@/types/job";

type FavoriteButtonProps = {
  jobId: number;
}

function getAnonId(): string {
  if (typeof window === "undefined") return "";
  let anonId = localStorage.getItem("anon_id");

  if (!anonId) {
    anonId = crypto.randomUUID();
    localStorage.setItem("anon_id", anonId);
  }
  return anonId;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function FavoriteButton({ jobId }: FavoriteButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const [anonId] = useState(() => getAnonId());

  useEffect(() => {
    async function checkFavorite() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/api/favorites?anon_id=${anonId}`)
        if (!res.ok) {
          throw new Error("Erro ao buscar favoritos");
        }
        const favoriteJobs = await res.json();
        setIsFavorite(favoriteJobs.some((job: Job) => job.id === jobId));
      } catch (err) {
        setError("Erro ao verificar favorito");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (anonId) {
      checkFavorite();
    }
  }, [anonId, jobId]);

  async function toggleFavorite() {
    if (!anonId) {
      setError("Usuário anônimo não encontrado");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (isFavorite) {
        const res = await fetch(`${API_URL}/api/favorites`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ anon_id: anonId, job_id: jobId }),
        })

        if (!res.ok) {
          throw new Error("Erro ao remover favorito");
        }

        setIsFavorite(false);
      } else {
        const res = await fetch(`${API_URL}/api/favorites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ anon_id: anonId, job_id: jobId }),
        })

        if (!res.ok) {
          throw new Error("Erro ao adicionar favorito");
        }

        setIsFavorite(true);
      }
    } catch (err) {
      setError("Erro ao atualizar favorito");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        size="icon"
        variant={isFavorite ? "default" : "outline"}
        aria-pressed={isFavorite}
        title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        onClick={toggleFavorite}
        disabled={loading}
        className={`text-xl shadow ${isFavorite ? "text-red-600 bg-red-50" : ""}`}
      >
        {isFavorite ? <FaHeart /> : <FaRegHeart />}
      </Button>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </>
  )
}