import { useRef } from "react";
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

        <button
          type="button"
          className="shrink-0 bg-[#262626] border border-[#363636] hover:bg-[#363636] text-white rounded-lg px-4 py-2.5 text-xs font-mono font-semibold transition-colors cursor-pointer"
          onClick={() => inputRef.current?.click()}
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

      <p className="text-xs font-mono text-[#4B4B4B]">Sélectionne une image ou colle une URL.</p>
      {error && <p className="text-red-400 text-xs font-mono">{error}</p>}
    </div>
  );
};

export default ImageUploadField;
