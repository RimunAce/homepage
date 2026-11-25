"use client";

import { useState, useEffect } from "react";
import { fetchProjects, type Project } from "@/app/lib/content";
import SafeImage from "./SafeImage";

function splitProjects(projects: Project[]) {
  const featured = projects.filter((p) => p.status !== "Archived");
  const rest = projects.filter((p) => p.status === "Archived");
  return { featured, rest };
}

function ArchivedProjects({ projects }: { projects: Project[] }) {
  const [open, setOpen] = useState(false);

  return (
    <details
      className="pt-2"
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary className="flex min-h-11 cursor-pointer list-none items-center border-y border-white/10 py-2 text-sm text-[#aeb5c4] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
        Show {projects.length} archived {projects.length === 1 ? "project" : "projects"}
      </summary>
      {open && (
        <div className="mt-4">
          {projects.map((project) => (
            <ProjectRow key={project.title} project={project} />
          ))}
        </div>
      )}
    </details>
  );
}

function ProjectRow({ project }: { project: Project }) {
  return (
    <article className={`grid gap-4 border-b border-white/10 py-6 ${project.thumbnail ? "sm:grid-cols-[7.5rem_minmax(0,1fr)]" : ""}`}>
      {project.thumbnail && (
        <div className="h-24 w-24 overflow-hidden rounded-lg border border-white/14 bg-[#151923] sm:h-28 sm:w-28">
          <SafeImage
            src={project.thumbnail}
            alt=""
            width={112}
            height={112}
            sizes="(max-width: 639px) 6rem, 7rem"
            fallbackLabel="No image"
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="font-display text-xl font-semibold leading-tight text-[#f2f3f6] sm:text-2xl">{project.title}</h3>
          <span className={`text-xs ${project.status === "Active" ? "text-[#c9b780]" : "text-[#aeb5c4]"}`}>
            {project.status}
          </span>
        </div>
        <p className="mt-2 max-w-prose text-sm leading-relaxed text-[#aeb5c4]">{project.description}</p>
        {project.tech.length > 0 && (
          <p className="mt-2 text-xs text-[#aeb5c4]">{project.tech.join(", ")}</p>
        )}
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex min-h-11 items-center text-sm text-[#f2f3f6] underline decoration-white/35 underline-offset-4 hover:decoration-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Visit {project.title}
          </a>
        )}
      </div>
    </article>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      try {
        const data = await fetchProjects();
        if (!cancelled) {
          setProjects(data);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setProjects([]);
          setError("Could not load projects right now. Try again later.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  const { featured, rest } = splitProjects(projects);

  return (
    <div>
      {loading && (
        <p className="py-4 text-sm text-[#aeb5c4]" role="status">Loading projects.</p>
      )}

      {error && !loading && (
        <div className="border border-[#d8b9a6]/60 bg-[#241e1b] p-4" role="alert">
          <p className="text-sm font-mono text-white">{error}</p>
        </div>
      )}

      {!loading && !error && featured.length === 0 && rest.length === 0 && (
        <p className="text-sm text-[#aeb5c4]">No projects to show right now.</p>
      )}

      {!loading && !error && (
        <div className="divide-y-0">
          {featured.map((project) => (
            <ProjectRow key={project.title} project={project} />
          ))}
          {rest.length > 0 && <ArchivedProjects projects={rest} />}
        </div>
      )}
    </div>
  );
}
