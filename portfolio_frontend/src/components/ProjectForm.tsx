import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm, useWatch, type FieldErrors } from "react-hook-form";
import { z } from "zod";
import Form from "./ui/Form";
import DisplaySettingsFields from "./project-form/DisplaySettingsFields";
import ProjectDetailsFields from "./project-form/ProjectDetailsFields";
import ProjectFormSubmitActions from "./project-form/ProjectFormSubmitActions";
import ProjectMainFields from "./project-form/ProjectMainFields";
import {
  defaultProjectDisplaySettings,
  type GalleryImageFormValue,
  type ProjectDisplaySettings,
} from "../types/project";
import { uploadImageToCloudinary } from "../services/cloudinary";

const isHttpUrl = (value: string) => {
  if (!value.trim()) return true;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const isImageUrlOrLocalPath = (value: string) => {
  const cleanValue = value.trim();
  if (!cleanValue) return true;
  if (cleanValue.startsWith("/")) return true;

  return isHttpUrl(cleanValue);
};

const displaySettingsSchema = z.object({
  show_cover: z.boolean(),
  show_gallery: z.boolean(),
  show_presentation: z.boolean(),
  show_context: z.boolean(),
  show_objective: z.boolean(),
  show_challenges: z.boolean(),
  show_solution: z.boolean(),
  show_learned_skills: z.boolean(),
});

const isFileValue = (value: unknown): value is File => (
  typeof File !== "undefined" && value instanceof File
);

const galleryImageSchema = z.object({
  url: z.string(),
  file: z.custom<File>(isFileValue).optional(),
  previewUrl: z.string().optional(),
});

const projectSchema = z.object({
  title: z.string().trim().min(3, "Le titre doit faire au moins 3 caractères"),
  description: z.string().trim().min(10, "La description doit faire au moins 10 caractères"),
  tech_stack: z.string().optional(),
  github_url: z.string().refine(isHttpUrl, "L'URL GitHub doit commencer par http:// ou https://").optional(),
  demo_url: z.string().refine(isHttpUrl, "L'URL de démo doit commencer par http:// ou https://").optional(),
  image_url: z.string().refine(isImageUrlOrLocalPath, "L'image principale doit être une URL valide ou un chemin local.").optional(),
  gallery_images: z.array(galleryImageSchema),
  context: z.string().optional(),
  objective: z.string().optional(),
  challenges: z.string().optional(),
  solution: z.string().optional(),
  learned_skills: z.string().optional(),
  display_settings: displaySettingsSchema,
}).superRefine((values, context) => {
  const validGalleryImages = values.gallery_images.filter((image) => (
    image.url.trim() || image.file
  ));

  values.gallery_images.forEach((image, index) => {
    const url = image.url.trim();
    if (!url) return;

    if (!isImageUrlOrLocalPath(url)) {
      context.addIssue({
        code: "custom",
        path: ["gallery_images", index, "url"],
        message: "Cette image doit être une URL valide ou un chemin local.",
      });
    }
  });

  if (values.display_settings.show_gallery && validGalleryImages.length === 0) {
    context.addIssue({
      code: "custom",
      path: ["gallery_images"],
      message: "Ajoute au moins une image pour activer le carousel.",
    });
  }
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

export type ProjectPayload = {
  title: string;
  description: string;
  tech_stack: string | null;
  github_url: string | null;
  demo_url: string | null;
  image_url: string | null;
  context: string | null;
  objective: string | null;
  challenges: string | null;
  solution: string | null;
  gallery_images: string[] | null;
  learned_skills: string[] | null;
  display_settings: ProjectDisplaySettings;
};

type ProjectFormProps = {
  defaultValues?: ProjectFormValues;
  isLoading?: boolean;
  submitLabel: string;
  loadingLabel: string;
  onSubmit: (payload: ProjectPayload) => Promise<void>;
  onCancel: () => void;
};

const emptyValues: ProjectFormValues = {
  title: "",
  description: "",
  tech_stack: "",
  github_url: "",
  demo_url: "",
  image_url: "",
  gallery_images: [],
  context: "",
  objective: "",
  challenges: "",
  solution: "",
  learned_skills: "",
  display_settings: defaultProjectDisplaySettings,
};

const linesToArray = (value?: string) => {
  const lines = value
    ?.split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return lines && lines.length > 0 ? lines : null;
};

const cleanText = (value?: string) => {
  const cleanedValue = value?.trim();
  return cleanedValue ? cleanedValue : null;
};

const getGalleryGlobalError = (error: FieldErrors<ProjectFormValues>["gallery_images"]) => {
  if (!error || Array.isArray(error)) return undefined;
  if ("message" in error && typeof error.message === "string") return error.message;

  return undefined;
};

const scrollToFirstError = () => {
  window.setTimeout(() => {
    const element = document.querySelector(".border-red-500") as HTMLElement | null;
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
    element?.focus();
  }, 0);
};

const ProjectForm = ({
  defaultValues,
  isLoading = false,
  submitLabel,
  loadingLabel,
  onSubmit,
  onCancel,
}: ProjectFormProps) => {
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const objectUrlsRef = useRef<string[]>([]);
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    shouldFocusError: true,
    defaultValues: {
      ...emptyValues,
      ...defaultValues,
      display_settings: {
        ...defaultProjectDisplaySettings,
        ...defaultValues?.display_settings,
      },
    },
  });

  const { append, fields, move, remove } = useFieldArray({
    control,
    name: "gallery_images",
  });

  const galleryValues = useWatch({ control, name: "gallery_images" }) || [];
  const showGallery = useWatch({ control, name: "display_settings.show_gallery" });
  const galleryImages = fields.map((field, index) => ({
    ...field,
    url: galleryValues[index]?.url ?? field.url,
  }));
  const galleryImageErrors = Array.isArray(errors.gallery_images)
    ? errors.gallery_images.map((error) => error?.url?.message)
    : [];

  useEffect(() => () => {
    objectUrlsRef.current.forEach((objectUrl) => URL.revokeObjectURL(objectUrl));
    objectUrlsRef.current = [];
  }, []);

  const createPreviewUrl = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    objectUrlsRef.current.push(objectUrl);

    return objectUrl;
  };

  const revokePreviewUrl = (objectUrl: string | undefined) => {
    if (!objectUrl) return;

    URL.revokeObjectURL(objectUrl);
    objectUrlsRef.current = objectUrlsRef.current.filter((storedUrl) => storedUrl !== objectUrl);
  };

  const selectCoverImageFile = (file: File | null) => {
    revokePreviewUrl(coverPreviewUrl || undefined);
    setCoverImageFile(file);
    setCoverPreviewUrl(file ? createPreviewUrl(file) : null);
  };

  const appendGalleryFiles = (files: File[]) => {
    append(files.map((file) => ({
      url: "",
      file,
      previewUrl: createPreviewUrl(file),
    })));
  };

  const changeGalleryImage = (index: number, value: string) => {
    const currentImage = galleryValues[index] as GalleryImageFormValue | undefined;
    revokePreviewUrl(currentImage?.previewUrl);
    setValue(`gallery_images.${index}`, {
      ...currentImage,
      url: value,
      file: undefined,
      previewUrl: undefined,
    }, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const removeGalleryImage = (index: number) => {
    const currentImage = galleryValues[index] as GalleryImageFormValue | undefined;
    revokePreviewUrl(currentImage?.previewUrl);
    remove(index);
  };

  const submitForm = async (values: ProjectFormValues) => {
    setIsUploadingImages(true);
    setUploadError(null);

    let uploadedCoverImageUrl: string | null;
    let galleryImagesPayload: string[];
    try {
      uploadedCoverImageUrl = coverImageFile
        ? (await uploadImageToCloudinary(coverImageFile)).secure_url
        : cleanText(values.image_url);

      const uploadedGalleryImages = await Promise.all(
        values.gallery_images.map(async (image) => {
          if (image.file) {
            return (await uploadImageToCloudinary(image.file)).secure_url;
          }

          return image.url.trim();
        })
      );
      galleryImagesPayload = uploadedGalleryImages.filter(Boolean);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload Cloudinary impossible.";
      setUploadError(message);
      return;
    } finally {
      setIsUploadingImages(false);
    }

    await onSubmit({
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
      tech_stack: cleanText(values.tech_stack),
      github_url: cleanText(values.github_url),
      demo_url: cleanText(values.demo_url),
      image_url: uploadedCoverImageUrl,
      context: cleanText(values.context),
      objective: cleanText(values.objective),
      challenges: cleanText(values.challenges),
      solution: cleanText(values.solution),
      gallery_images: galleryImagesPayload.length > 0 ? galleryImagesPayload : null,
      learned_skills: linesToArray(values.learned_skills),
    });
  };

  const isSubmitting = isLoading || isUploadingImages;

  return (
    <Form onSubmit={handleSubmit(submitForm, scrollToFirstError)} className="space-y-8">
      <ProjectMainFields
        control={control}
        register={register}
        errors={errors}
        showGallery={showGallery}
        galleryImages={galleryImages}
        galleryImageErrors={galleryImageErrors}
        galleryGlobalError={getGalleryGlobalError(errors.gallery_images)}
        coverPreviewUrl={coverPreviewUrl}
        onCoverFileSelect={selectCoverImageFile}
        onAddGalleryUrl={() => append({ url: "" })}
        onAppendGalleryFiles={appendGalleryFiles}
        onChangeGalleryImage={changeGalleryImage}
        onRemoveGalleryImage={removeGalleryImage}
        onMoveGalleryImage={move}
      />

      <hr className="border-[#262626]" />

      <DisplaySettingsFields register={register} />

      <hr className="border-[#262626]" />

      <ProjectDetailsFields register={register} />

      {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}

      <ProjectFormSubmitActions
        isLoading={isLoading}
        isUploadingImages={isUploadingImages}
        isSubmitting={isSubmitting}
        submitLabel={submitLabel}
        loadingLabel={loadingLabel}
        onCancel={onCancel}
      />
    </Form>
  );
};

export default ProjectForm;
