import Button from "../ui/Button";
import { FormActions } from "../ui/Form";

type ProjectFormSubmitActionsProps = {
  isLoading: boolean;
  isUploadingImages: boolean;
  isSubmitting: boolean;
  submitLabel: string;
  loadingLabel: string;
  onCancel: () => void;
};

const ProjectFormSubmitActions = ({
  isLoading,
  isUploadingImages,
  isSubmitting,
  submitLabel,
  loadingLabel,
  onCancel,
}: ProjectFormSubmitActionsProps) => (
  <FormActions className="border-t border-[#262626] pt-6">
    <Button
      type="button"
      className="bg-transparent border border-[#262626] text-[#A1A1AA] hover:bg-[#1C1C1C] hover:text-white font-mono text-xs uppercase tracking-wider transition-colors px-5 py-2.5"
      onClick={onCancel}
    >
      Annuler
    </Button>
    <Button
      type="submit"
      disabled={isSubmitting}
      className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-mono text-xs uppercase tracking-wider px-5 py-2.5"
    >
      {isUploadingImages ? "Upload images..." : isLoading ? loadingLabel : submitLabel}
    </Button>
  </FormActions>
);

export default ProjectFormSubmitActions;

