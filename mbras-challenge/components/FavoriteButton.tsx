"use client";

import { createClient } from "@/utils/supabase/browser";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";

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

export default function FavoriteButton({ jobId }: FavoriteButtonProps) {
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const [anonId] = useState(() => getAnonId());

  useEffect(() => {
    async function checkFavorite() {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase.from("favorites").select("id").eq("anon_id", anonId).eq("job_id", jobId).maybeSingle();

        if (error) {
          throw error;
        }
        setIsFavorite(!!data);
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
  }, [anonId, jobId, supabase]);

  async function toggleFavorite() {
    if (!anonId) {
      setError("Usuário anônimo não encontrado");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (isFavorite) {
        const { error } = await supabase.from("favorites").delete().eq("anon_id", anonId).eq("job_id", jobId);
        if (error) {
          throw error;
        }
        setIsFavorite(false);
      } else {
        const { error } = await supabase.from("favorites").insert({ anon_id: anonId, job_id: jobId });
        if (error) {
          throw error;
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