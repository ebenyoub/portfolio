import type { UseFormRegister } from "react-hook-form";
import { FormGroup, FormSection, FormTitle } from "../ui/Form";
import { Label } from "../ui/Input";
import type { ProjectFormValues } from "../ProjectForm";

type ProjectDetailsFieldsProps = {
  register: UseFormRegister<ProjectFormValues>;
};

const textareaClass = "w-full bg-[#0A0A0A] border border-[#262626] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#4B4B4B] font-mono outline-none focus:border-[#3B82F6] transition-colors";

const ProjectDetailsFields = ({ register }: ProjectDetailsFieldsProps) => (
  <FormSection>
    <FormTitle className="text-sm font-mono text-[#A1A1AA] uppercase tracking-wider mb-4">
      Détails approfondis
    </FormTitle>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormGroup>
        <Label htmlFor="context">Contexte du projet</Label>
        <textarea
          id="context"
          rows={3}
          className={textareaClass}
          placeholder="Pourquoi ce projet a-t-il été créé ?"
          {...register("context")}
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="objective">Objectifs</Label>
        <textarea
          id="objective"
          rows={3}
          className={textareaClass}
          placeholder="Quels étaient les buts à atteindre ?"
          {...register("objective")}
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="challenges">Défis rencontrés</Label>
        <textarea
          id="challenges"
          rows={3}
          className={textareaClass}
          placeholder="Quelles difficultés avez-vous surmontées ?"
          {...register("challenges")}
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="solution">Solutions apportées</Label>
        <textarea
          id="solution"
          rows={3}
          className={textareaClass}
          placeholder="Comment avez-vous résolu ces problèmes ?"
          {...register("solution")}
        />
      </FormGroup>

      <FormGroup className="md:col-span-2">
        <Label htmlFor="learned_skills">Compétences acquises</Label>
        <textarea
          id="learned_skills"
          rows={4}
          className={textareaClass}
          placeholder="Langage C"
          {...register("learned_skills")}
        />
        <p className="text-xs text-[#4B4B4B] font-mono mt-1">Une compétence par ligne.</p>
      </FormGroup>
    </div>
  </FormSection>
);

export default ProjectDetailsFields;

