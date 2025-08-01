import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { Job } from "@/types/job";

export default function JobCard({ job }: { job: Job }) {
  return (
    <Link href={job.url} passHref className="focus:outline-none group">
        <Card className="transition-shadow hover:shadow-xl focus:ring-2 ring-primary cursor-pointer min-h-[180px]">
          <CardHeader className="flex flex-row items-center gap-4 pb-1">
            <Image
              src={job.company_logo}
              alt={job.company_name}
              width={24}
              height={24}
              className="w-12 h-12 object-contain rounded bg-muted"
            />
            <div>
              <CardTitle className="text-lg leading-tight">{job.title}</CardTitle>
              <CardDescription className="font-semibold text-sm opacity-80">
                {job.company_name}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="bg-muted px-2 py-0.5 rounded text-xs font-medium capitalize">{job.category.replace('-', ' ')}</span>
              <span className="bg-muted px-2 py-0.5 rounded text-xs font-medium capitalize">{job.job_type.replace('_', ' ')}</span>
              <span className="bg-muted px-2 py-0.5 rounded text-xs font-medium">{job.candidate_required_location}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted-foreground">
                {new Date(job.publication_date).toLocaleDateString("pt-BR")}
              </span>
              {job.salary && (
                  <span className="text-xs font-bold text-green-700">{job.salary}</span>
              )}
            </div>
          </CardContent>
        </Card>
    </Link>
  )
}