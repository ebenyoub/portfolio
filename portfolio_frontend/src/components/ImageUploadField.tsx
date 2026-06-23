import { useRef } from "react";
import Button from "./ui/Button";
import Input, { Label } from "./ui/Input";
import { getImageSrc } from "../utils/images";

type ImageUploadFieldProps = {
  id: string;
  label: string;
  value: string;
  selectedPreviewUrl?: string | null;
  error?: string;
  required?: boolean;
  onChange: (value: string) => void;
  onFileSelect: (file: File | null) => void;
};

const ImageUploadField = ({
  id,
  label,
  value,
  selectedPreviewUrl = null,
  error,
  required = false,
  onChange,
  onFileSelect,
}: ImageUploadFieldProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const previewSrc = selectedPreviewUrl || getImageSrc(value);

  const updateValue = (nextValue: string) => {
    onFileSelect(null);
    onChange(nextValue);
  };

  const selectFile = (file: File) => {
    onFileSelect(file);
    onChange("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>
        {label} {required && <span className="text-red-600">*</span>}
      </Label>

      {previewSrc && (
        <div className="h-40 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
          <img src={previewSrc} alt="" className="h-full w-full object-cover" />
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          id={id}
          value={value}
          onChange={(event) => updateValue(event.target.value)}
          placeholder="https://res.cloudinary.com/... ou /project-images/..."
          className={error ? "border-red-500" : ""}
        />

        <input
          ref={inputRef}
          type="file"
          aria-label={`Sélectionner ${label}`}
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              selectFile(file);
            }
          }}
        />

        <Button
          type="button"
          className="shrink-0 bg-gray-900 hover:bg-gray-800"
          onClick={() => inputRef.current?.click()}
        >
          Choisir
        </Button>

        {(value || selectedPreviewUrl) && (
          <Button
            type="button"
            className="shrink-0 bg-gray-100 text-gray-700 hover:bg-gray-200"
            onClick={() => updateValue("")}
          >
            Retirer
          </Button>
        )}
      </div>

      <p className="text-xs text-gray-500">Sélectionne une image ou colle une URL.</p>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default ImageUploadField;
