import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import ImageUploadField from '../components/ImageUploadField';

const imageFile = new File(['cover'], 'cover.png', { type: 'image/png' });

const renderField = () => {
  const onChange = vi.fn();
  const onFileSelect = vi.fn();

  const Harness = () => {
    const [value, setValue] = useState('');
    const [selectedPreviewUrl, setSelectedPreviewUrl] = useState<string | null>(null);

    return (
      <ImageUploadField
        id="image_url"
        label="Image de couverture"
        value={value}
        selectedPreviewUrl={selectedPreviewUrl}
        onChange={(nextValue) => {
          onChange(nextValue);
          setValue(nextValue);
        }}
        onFileSelect={(file) => {
          onFileSelect(file);
          setSelectedPreviewUrl(file ? URL.createObjectURL(file) : null);
        }}
      />
    );
  };

  const renderResult = render(<Harness />);

  return { ...renderResult, onChange, onFileSelect };
};

describe('ImageUploadField', () => {
  it('keeps the selected file in memory and shows a local preview without uploading', async () => {
    const user = userEvent.setup();
    const { container, onChange, onFileSelect } = renderField();

    await user.upload(screen.getByLabelText('Sélectionner Image de couverture'), imageFile);

    expect(onFileSelect).toHaveBeenCalledWith(imageFile);
    expect(onChange).toHaveBeenCalledWith('');
    expect(URL.createObjectURL).toHaveBeenCalledWith(imageFile);
    expect(container.querySelector('img')).toHaveAttribute('src', 'blob:local-preview');
  });
});
