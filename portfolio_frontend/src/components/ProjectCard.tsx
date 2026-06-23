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
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#262626] bg-[#111111] transition-all duration-300 hover:border-[#3B82F6]/40 hover:shadow-[0_0_40px_rgba(59,130,246,0.06)]">
      <div className="relative h-44 bg-[#1A1A1A] overflow-hidden flex-shrink-0">
        {image_url && !imageFailed ? (
          <img
            src={getImageSrc(image_url)}
            alt={title}
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover opacity-50 group-hover:opacity-65 group-hover:scale-[1.03] transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-950 p-4 text-center text-sm font-bold text-white opacity-40">
            {title}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/30 to-transparent" />
        <div className="absolute right-3 top-3">
          <span className="rounded border border-[#262626] bg-[#0A0A0A]/80 px-2 py-0.5 text-[10px] font-mono text-[#A1A1AA] backdrop-blur-sm">
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
          <button
            type="button"
            onClick={onOpenDetail}
            className="flex items-center gap-1.5 text-xs font-medium text-[#3B82F6] transition-all group-hover:gap-2.5"
            aria-label={`Voir le detail de ${title}`}
          >
            Voir le détail
            <ArrowUpRight size={13} />
          </button>
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
