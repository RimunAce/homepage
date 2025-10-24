"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { DATA_URLS } from "@/app/lib/dataUrls";

interface Project {
  title: string;
  description: string;
  tech: string[];
  status: string;
  link: string;
  date: string;
  thumbnail: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch(DATA_URLS.projects)
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error loading projects:", error));
  }, []);

  return (
    <section id="projects" className="retro-card">
      <h2 className="retro-heading">PROJECTS</h2>
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 retro-scrollbar">
        {projects.map((project) => (
          <div
            key={project.title}
            className="border-b border-retro-black pb-3 last:border-b-0"
          >
            <div className="flex gap-3 mb-2">
              {project.thumbnail && (
                <div
                  className="w-20 h-20 flex-shrink-0 border-2 border-retro-black overflow-hidden"
                  style={{ boxShadow: "3px 3px 0px #000000" }}
                >
                  <Image
                    src={project.thumbnail}
                    alt={project.title}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-sm">{project.title}</h3>
                  <span
                    className={`text-xs px-2 py-1 flex-shrink-0 ml-2 ${
                      project.status === "Active"
                        ? "bg-retro-black text-retro-white"
                        : "bg-retro-gray text-retro-black border border-retro-black"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="retro-text text-xs mb-2">{project.description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="text-xs bg-retro-gray px-2 py-1 border border-retro-black"
                >
                  {tech}
                </span>
              ))}
            </div>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs retro-link inline-block"
              >
                Visit Project →
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
