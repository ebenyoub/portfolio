import type { UseFormRegister } from "react-hook-form";
import { FormGroup, FormSection, FormTitle } from "../ui/Form";
import { Label } from "../ui/Input";
import type { ProjectFormValues } from "../ProjectForm";

type ProjectDetailsFieldsProps = {
  register: UseFormRegister<ProjectFormValues>;
};

const ProjectDetailsFields = ({ register }: ProjectDetailsFieldsProps) => (
  <FormSection>
    <FormTitle className="text-lg font-bold text-gray-800">Détails approfondis</FormTitle>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormGroup>
        <Label htmlFor="context">Contexte du projet</Label>
        <textarea
          id="context"
          rows={3}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
          placeholder="Pourquoi ce projet a-t-il été créé ?"
          {...register("context")}
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="objective">Objectifs</Label>
        <textarea
          id="objective"
          rows={3}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
          placeholder="Quels étaient les buts à atteindre ?"
          {...register("objective")}
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="challenges">Défis rencontrés</Label>
        <textarea
          id="challenges"
          rows={3}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
          placeholder="Quelles difficultés avez-vous surmontées ?"
          {...register("challenges")}
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="solution">Solutions apportées</Label>
        <textarea
          id="solution"
          rows={3}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
          placeholder="Comment avez-vous résolu ces problèmes ?"
          {...register("solution")}
        />
      </FormGroup>

      <FormGroup className="md:col-span-2">
        <Label htmlFor="learned_skills">Compétences acquises</Label>
        <textarea
          id="learned_skills"
          rows={4}
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
          placeholder="Langage C"
          {...register("learned_skills")}
        />
        <p className="text-xs text-gray-500">Une compétence par ligne.</p>
      </FormGroup>
    </div>
  </FormSection>
);

export default ProjectDetailsFields;
