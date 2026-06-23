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
  <FormActions>
    <Button
      type="button"
      className="bg-gray-100 text-gray-700 hover:bg-gray-200"
      onClick={onCancel}
    >
      Annuler
    </Button>
    <Button type="submit" disabled={isSubmitting}>
      {isUploadingImages ? "Upload images..." : isLoading ? loadingLabel : submitLabel}
    </Button>
  </FormActions>
);

export default ProjectFormSubmitActions;
