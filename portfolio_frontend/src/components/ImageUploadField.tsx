import { useState } from "react";
import Input, { Label } from "./ui/Input";
import { getImageSrc } from "../utils/images";
import MediaPickerModal from "./MediaPickerModal";

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
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const previewSrc = selectedPreviewUrl || getImageSrc(value);

  const updateValue = (nextValue: string) => {
    onFileSelect(null);
    onChange(nextValue);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>
        {label} {required && <span className="text-red-400">*</span>}
      </Label>

      {previewSrc && (
        <div className="h-40 overflow-hidden rounded-lg border border-[#262626] bg-[#0A0A0A] relative group/preview">
          <img src={previewSrc} alt="" className="h-full w-full object-cover opacity-80" />
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          id={id}
          value={value}
          onChange={(event) => updateValue(event.target.value)}
          placeholder="https://res.cloudinary.com/... ou /project-images/..."
          className={error ? "border-red-500/50" : ""}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />

        <button
          type="button"
          className="shrink-0 bg-[#262626] border border-[#363636] hover:bg-[#363636] text-white rounded-lg px-4 py-2.5 text-xs font-mono font-semibold transition-colors cursor-pointer"
          onClick={() => setIsPickerOpen(true)}
        >
          Choisir
        </button>

        {(value || selectedPreviewUrl) && (
          <button
            type="button"
            className="shrink-0 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg px-4 py-2.5 text-xs font-mono font-semibold transition-colors cursor-pointer"
            onClick={() => updateValue("")}
          >
            Retirer
          </button>
        )}
      </div>

      <p className="text-xs font-mono text-[#4B4B4B]">Sélectionnez une image de la médiathèque ou collez une URL.</p>
      {error && <p id={`${id}-error`} role="alert" className="text-red-400 text-xs font-mono">{error}</p>}

      <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={(url) => updateValue(url)}
      />
    </div>
  );
};

export default ImageUploadField;
