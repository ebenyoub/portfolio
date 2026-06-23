import type { UseFormRegister } from "react-hook-form";
import { FormSection, FormTitle } from "../ui/Form";
import type { ProjectDisplaySettings } from "../../types/project";
import type { ProjectFormValues } from "../ProjectForm";

const checkboxOptions: { name: keyof ProjectDisplaySettings; label: string }[] = [
  { name: "show_cover", label: "Image de couverture" },
  { name: "show_gallery", label: "Carousel / galerie" },
  { name: "show_presentation", label: "Présentation" },
  { name: "show_context", label: "Contexte" },
  { name: "show_objective", label: "Objectifs" },
  { name: "show_challenges", label: "Défis" },
  { name: "show_solution", label: "Solution" },
  { name: "show_learned_skills", label: "Compétences acquises" },
];

type DisplaySettingsFieldsProps = {
  register: UseFormRegister<ProjectFormValues>;
};

const DisplaySettingsFields = ({ register }: DisplaySettingsFieldsProps) => (
  <FormSection>
    <FormTitle className="text-sm font-mono text-[#A1A1AA] uppercase tracking-wider mb-4">
      Sections visibles sur la page détail
    </FormTitle>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {checkboxOptions.map((option) => (
        <label
          key={option.name}
          className="flex items-center gap-3 rounded-lg border border-[#262626] bg-[#0A0A0A] px-3 py-2 text-sm font-medium text-gray-300 hover:border-[#3B82F6]/50 hover:bg-[#111111] transition-colors cursor-pointer"
        >
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-[#262626] bg-[#0A0A0A] text-[#3B82F6] focus:ring-[#3B82F6] focus:ring-offset-[#111111] bg-none cursor-pointer"
            {...register(`display_settings.${option.name}`)}
          />
          <span className="font-mono text-xs uppercase tracking-wider">{option.label}</span>
        </label>
      ))}
    </div>
  </FormSection>
);

export default DisplaySettingsFields;

