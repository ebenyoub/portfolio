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
    <FormTitle className="text-lg font-bold text-gray-800">Sections visibles sur la page détail</FormTitle>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {checkboxOptions.map((option) => (
        <label
          key={option.name}
          className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700"
        >
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            {...register(`display_settings.${option.name}`)}
          />
          {option.label}
        </label>
      ))}
    </div>
  </FormSection>
);

export default DisplaySettingsFields;
