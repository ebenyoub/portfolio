import { Link } from "react-router-dom";
import { useState } from "react";
import { Github, ArrowUpRight } from "lucide-react";
import { getImageSrc } from "../utils/images";

export interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  image_url?: string;
  tech_stack?: string;
  github_url?: string;
  demo_url?: string;
}

const ProjectCard = ({
  id,
  title,
  description,
  image_url,
  tech_stack,
  github_url,
}: ProjectCardProps) => {
  const [imageFailed, setImageFailed] = useState(false);
  const stack = tech_stack
    ? tech_stack.split(",").map((tech) => tech.trim()).filter(Boolean)
    : [];

  return (
    <Link
      to={`/projects/${id}`}
      className="group bg-[#111111] border border-[#262626] rounded-xl overflow-hidden cursor-pointer hover:border-[#3B82F6]/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.06)] flex flex-col h-full"
    >
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
          <span className="flex items-center gap-1.5 text-xs text-[#3B82F6] font-medium group-hover:gap-2.5 transition-all">
            Voir le détail
            <ArrowUpRight size={13} />
          </span>
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
    </Link>
  );
};

export default ProjectCard;
