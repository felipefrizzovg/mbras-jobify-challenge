"use client";

import { Job } from "@/types/job";
import { useState } from "react";
import Filter from "./Filter";
import JobCard from "./JobCard";
import { Category } from "@/types/category";

type Props = {
  jobs: Job[];
  categories: Category[];
  initialCategory?: string;
}

export default function ClientJobsGrid({ jobs, categories, initialCategory = "" }: Props) {
  const [category, setCategory] = useState(initialCategory);

  const filteredJobs = category
    ? jobs.filter((job) => job.category.toLocaleLowerCase() === category.toLocaleLowerCase())
    : jobs;

  return (
    <>
      <div className="flex items-center justify-center py-4">
        <Filter value={category} onChange={setCategory} options={categories} />
      </div>
      <div className="py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
          {filteredJobs.length === 0 && (
            <p className="col-span-full mx-auto text-center text-muted-foreground">
              Nenhuma vaga foi encontrada para esta categoria
            </p>
          )}
        </div>
      </div>
    </>
  );
}
