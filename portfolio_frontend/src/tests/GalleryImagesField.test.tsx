import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import GalleryImagesField from '../components/GalleryImagesField';
import type { GalleryImageFormValue } from '../types/project';

type GalleryField = GalleryImageFormValue & {
  id: string;
};

const firstImage = new File(['first'], 'first.png', { type: 'image/png' });
const secondImage = new File(['second'], 'second.png', { type: 'image/png' });

const renderField = () => {
  const onAppendFiles = vi.fn();

  const Harness = () => {
    const [images, setImages] = useState<GalleryField[]>([]);

    return (
      <GalleryImagesField
        label="Images du carousel"
        images={images}
        onAddUrl={() => setImages((currentImages) => [
          ...currentImages,
          { id: String(currentImages.length), url: '' },
        ])}
        onAppendFiles={(files) => {
          onAppendFiles(files);
          setImages((currentImages) => [
            ...currentImages,
            ...files.map((file, index) => ({
              id: `${currentImages.length}-${index}`,
              url: '',
              file,
              previewUrl: URL.createObjectURL(file),
            })),
          ]);
        }}
        onChangeImage={(index, value) => setImages((currentImages) => currentImages.map((image, imageIndex) => (
          imageIndex === index ? { ...image, url: value, file: undefined } : image
        )))}
        onRemoveImage={(index) => setImages((currentImages) => currentImages.filter((_, imageIndex) => imageIndex !== index))}
        onMoveImage={() => undefined}
      />
    );
  };

  const renderResult = render(<Harness />);

  return { ...renderResult, onAppendFiles };
};

describe('GalleryImagesField', () => {
  it('keeps selected files in memory and shows local previews without uploading', async () => {
    const user = userEvent.setup();
    const { container, onAppendFiles } = renderField();

    await user.upload(screen.getByLabelText('Sélectionner les images du carousel'), [firstImage, secondImage]);

    expect(onAppendFiles).toHaveBeenCalledWith([firstImage, secondImage]);
    expect(URL.createObjectURL).toHaveBeenCalledTimes(2);
    expect(container.querySelectorAll('img')).toHaveLength(2);
  });
});
