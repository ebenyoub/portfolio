import { Controller, type Control, type FieldErrors, type UseFormRegister } from "react-hook-form";
import GalleryImagesField from "../GalleryImagesField";
import ImageUploadField from "../ImageUploadField";
import { FormGroup } from "../ui/Form";
import Input, { Label } from "../ui/Input";
import type { GalleryImageFormValue } from "../../types/project";
import type { ProjectFormValues } from "../ProjectForm";

type GalleryFieldValue = GalleryImageFormValue & {
  id: string;
};

type ProjectMainFieldsProps = {
  control: Control<ProjectFormValues>;
  register: UseFormRegister<ProjectFormValues>;
  errors: FieldErrors<ProjectFormValues>;
  showGallery: boolean;
  galleryImages: GalleryFieldValue[];
  galleryImageErrors: (string | undefined)[];
  galleryGlobalError?: string;
  coverPreviewUrl: string | null;
  onCoverFileSelect: (file: File | null) => void;
  onAddGalleryUrl: () => void;
  onAppendGalleryFiles: (files: File[]) => void;
  onChangeGalleryImage: (index: number, value: string) => void;
  onRemoveGalleryImage: (index: number) => void;
  onMoveGalleryImage: (from: number, to: number) => void;
};

const ProjectMainFields = ({
  control,
  register,
  errors,
  showGallery,
  galleryImages,
  galleryImageErrors,
  galleryGlobalError,
  coverPreviewUrl,
  onCoverFileSelect,
  onAddGalleryUrl,
  onAppendGalleryFiles,
  onChangeGalleryImage,
  onRemoveGalleryImage,
  onMoveGalleryImage,
}: ProjectMainFieldsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <FormGroup>
      <Label htmlFor="title">Titre du projet <span className="text-red-400">*</span></Label>
      <Input
        id="title"
        placeholder="Ex: Cub3d"
        {...register("title")}
        aria-invalid={!!errors.title}
        className={errors.title ? "border-red-500/50" : ""}
      />
      {errors.title && <p role="alert" className="text-red-400 text-xs mt-1 font-mono">{errors.title.message}</p>}
    </FormGroup>

    <FormGroup>
      <Label htmlFor="tech_stack">Technologies</Label>
      <Input
        id="tech_stack"
        placeholder="Ex: C, MiniLibX, Raycasting"
        {...register("tech_stack")}
      />
    </FormGroup>

    <FormGroup className="md:col-span-2">
      <Label htmlFor="description">Description courte <span className="text-red-400">*</span></Label>
      <textarea
        id="description"
        rows={3}
        className={`w-full bg-[#0A0A0A] border rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#4B4B4B] font-mono outline-none focus:border-[#3B82F6] transition-colors ${errors.description ? "border-red-500/50" : "border-[#262626]"}`}
        placeholder="Décrivez brièvement le projet..."
        aria-invalid={!!errors.description}
        {...register("description")}
      />
      {errors.description && <p role="alert" className="text-red-400 text-xs mt-1 font-mono">{errors.description.message}</p>}
    </FormGroup>

    <FormGroup>
      <Label htmlFor="github_url">URL GitHub</Label>
      <Input
        id="github_url"
        placeholder="https://github.com/..."
        {...register("github_url")}
        aria-invalid={!!errors.github_url}
        className={errors.github_url ? "border-red-500/50" : ""}
      />
      {errors.github_url && <p role="alert" className="text-red-400 text-xs mt-1 font-mono">{errors.github_url.message}</p>}
    </FormGroup>

    <FormGroup>
      <Label htmlFor="demo_url">URL Démo</Label>
      <Input
        id="demo_url"
        placeholder="https://..."
        {...register("demo_url")}
        aria-invalid={!!errors.demo_url}
        className={errors.demo_url ? "border-red-500/50" : ""}
      />
      {errors.demo_url && <p role="alert" className="text-red-400 text-xs mt-1 font-mono">{errors.demo_url.message}</p>}
    </FormGroup>

    <FormGroup className="md:col-span-2">
      <Controller
        control={control}
        name="image_url"
        render={({ field }) => (
          <ImageUploadField
            id="image_url"
            label="Image de couverture"
            value={field.value || ""}
            selectedPreviewUrl={coverPreviewUrl}
            error={errors.image_url?.message}
            onChange={(value) => field.onChange(value)}
            onFileSelect={onCoverFileSelect}
          />
        )}
      />
    </FormGroup>

    <FormGroup className="md:col-span-2">
      <GalleryImagesField
        label="Images du carousel"
        required={showGallery}
        images={galleryImages}
        errors={galleryImageErrors}
        globalError={galleryGlobalError}
        onAddUrl={onAddGalleryUrl}
        onAppendFiles={onAppendGalleryFiles}
        onChangeImage={onChangeGalleryImage}
        onRemoveImage={onRemoveGalleryImage}
        onMoveImage={onMoveGalleryImage}
      />
    </FormGroup>
  </div>
);

export default ProjectMainFields;
