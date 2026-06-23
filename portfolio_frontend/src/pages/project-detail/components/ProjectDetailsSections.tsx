import type { Project } from "../../../types/project";

type ProjectDetailsSectionsProps = {
  project: Project;
  learnedSkills: string[];
  showPresentation: boolean;
  showContext: boolean;
  showObjective: boolean;
  showChallenges: boolean;
  showSolution: boolean;
  showLearnedSkills: boolean;
};

const CaseStudyBlock = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <div className="border border-[#1E1E1E] rounded-xl p-4 bg-[#0F0F0F]">
      <h4 className="text-xs font-mono text-[#A1A1AA] uppercase tracking-widest mb-3">{title}</h4>
      {children}
    </div>
  );
};

const ProjectDetailsSections = ({
  project,
  learnedSkills,
  showPresentation,
  showContext,
  showObjective,
  showChallenges,
  showSolution,
  showLearnedSkills,
}: ProjectDetailsSectionsProps) => {
  const hasMainDetails = showPresentation || showContext || showObjective || showChallenges || showSolution;

  if (!hasMainDetails && !showLearnedSkills) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 bg-[#0A0A0A] text-white">
      <div className={`grid grid-cols-1 gap-6 ${showLearnedSkills && hasMainDetails ? "lg:grid-cols-[2fr_1fr]" : ""}`}>
        {hasMainDetails && (
          <div className="space-y-6">
            {showPresentation && (
              <CaseStudyBlock title="Présentation">
                <p className="text-[#A1A1AA] text-sm leading-relaxed">{project.description}</p>
              </CaseStudyBlock>
            )}

            {showContext && (
              <CaseStudyBlock title="Contexte">
                <p className="text-[#A1A1AA] text-sm leading-relaxed">{project.context}</p>
              </CaseStudyBlock>
            )}

            {showObjective && (
              <CaseStudyBlock title="Objectifs">
                <ul className="space-y-2">
                  {project.objective?.split("\n").map((obj, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[#A1A1AA]">
                      <span className="text-[#3B82F6] mt-0.5 flex-shrink-0">▸</span>
                      {obj.trim().replace(/^-\s*/, "")}
                    </li>
                  ))}
                </ul>
              </CaseStudyBlock>
            )}

            {(showChallenges || showSolution) && (
              <div className="grid md:grid-cols-2 gap-4">
                {showChallenges && (
                  <CaseStudyBlock title="Difficultés rencontrées">
                    <ul className="space-y-2">
                      {project.challenges?.split("\n").map((c, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-[#A1A1AA]">
                          <span className="text-[#F59E0B] mt-0.5 flex-shrink-0">▸</span>
                          {c.trim().replace(/^-\s*/, "")}
                        </li>
                      ))}
                    </ul>
                  </CaseStudyBlock>
                )}

                {showSolution && (
                  <CaseStudyBlock title="Solutions apportées">
                    <ul className="space-y-2">
                      {project.solution?.split("\n").map((s, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-[#A1A1AA]">
                          <span className="text-[#10B981] mt-0.5 flex-shrink-0">▸</span>
                          {s.trim().replace(/^-\s*/, "")}
                        </li>
                      ))}
                    </ul>
                  </CaseStudyBlock>
                )}
              </div>
            )}
          </div>
        )}

        {showLearnedSkills && (
          <aside className="space-y-6">
            <CaseStudyBlock title="Ce que j'ai appris">
              <ul className="space-y-2">
                {learnedSkills.map((skill, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-sm text-[#A1A1AA]">
                    <span className="text-[#8B5CF6] mt-0.5 flex-shrink-0">▸</span>
                    {skill}
                  </li>
                ))}
              </ul>
            </CaseStudyBlock>
          </aside>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailsSections;
