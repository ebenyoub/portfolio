import { useState } from "react";
import { Github, ArrowUpRight } from "lucide-react";
import { getImageSrc } from "../utils/images";
import { getProjectCategory } from "../utils/projectPresentation";
import type { Project } from "../types/project";

export interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  tech_stack?: string;
  github_url?: string;
  demo_url?: string;
  onOpenDetail: () => void;
}

const ProjectCard = ({
  title,
  description,
  image_url,
  tech_stack,
  github_url,
  demo_url,
  onOpenDetail,
}: ProjectCardProps) => {
  const [imageFailed, setImageFailed] = useState(false);
  const stack = tech_stack
    ? tech_stack.split(",").map((tech) => tech.trim()).filter(Boolean)
    : [];
  const category = getProjectCategory({
    id: 0,
    title,
    description,
    tech_stack,
  } as Project);

  return (
    <article
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-[#262626] bg-[#111111] transition-all duration-300 hover:border-[#3B82F6]/40 hover:shadow-[0_0_40px_rgba(59,130,246,0.06)]"
      onClick={onOpenDetail}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenDetail();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Ouvrir le detail de ${title}`}
    >
      <div className="relative -mx-px -mt-px h-44 overflow-hidden rounded-t-[inherit] bg-[#1A1A1A] flex-shrink-0">
        {image_url && !imageFailed ? (
          <img
            src={getImageSrc(image_url)}
            alt={title}
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-950 p-4 text-center text-sm font-bold text-white opacity-40">
            {title}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/60 to-transparent" />
        <div className="absolute right-3 top-3">
          <span className="rounded border border-[#262626] bg-[#0A0A0A]/85 px-2 py-0.5 text-[10px] font-mono text-[#A1A1AA] backdrop-blur-sm">
            {category}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-base font-bold text-white mb-2 tracking-tight" style={{ fontFamily: "Manrope, sans-serif" }}>
          {title}
        </h3>
        <p className="text-[#A1A1AA] text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
          {description}
        </p>
        
        {stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {stack.slice(0, 4).map((tech) => (
              <span key={tech} className="text-[11px] font-mono px-2 py-0.5 rounded border border-[#262626] bg-[#0A0A0A] text-[#A1A1AA]">
                {tech}
              </span>
            ))}
            {stack.length > 4 && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-[#262626] bg-[#0A0A0A] text-[#A1A1AA]">
                +{stack.length - 4}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetail();
              }}
              className="flex items-center gap-1 text-xs font-semibold text-[#3B82F6] hover:text-[#60A5FA] transition-colors"
              aria-label={`Voir le detail de ${title}`}
            >
              Voir le détail
              <ArrowUpRight size={13} />
            </button>
            {demo_url && (
              <a
                href={demo_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-0.5 rounded border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-2 py-0.5 text-[11px] font-mono text-[#60A5FA] hover:bg-[#3B82F6]/25 transition-all"
                aria-label={`Ouvrir la démo de ${title}`}
              >
                Démo
              </a>
            )}
          </div>
          {github_url && (
            <a
              href={github_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-[#A1A1AA] hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github size={15} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
