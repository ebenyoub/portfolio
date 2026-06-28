import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import GalleryImagesField from '../components/GalleryImagesField';
import type { GalleryImageFormValue } from '../types/project';

type GalleryField = GalleryImageFormValue & {
  id: string;
};

const renderField = () => {
  const onChangeImage = vi.fn();

  const Harness = () => {
    const [images, setImages] = useState<GalleryField[]>([]);

    return (
      <GalleryImagesField
        label="Images du carousel"
        images={images}
        onAddUrl={() => setImages((current) => [
          ...current,
          { id: String(current.length), url: '' },
        ])}
        onChangeImage={(index, value) => {
          onChangeImage(index, value);
          setImages((current) => current.map((img, i) =>
            i === index ? { ...img, url: value } : img
          ));
        }}
        onRemoveImage={(index) => setImages((current) => current.filter((_, i) => i !== index))}
        onMoveImage={vi.fn()}
      />
    );
  };

  const renderResult = render(<Harness />);

  return { ...renderResult, onChangeImage };
};

describe('GalleryImagesField', () => {
  it('renders the Choisir des images and Ajouter une URL vide buttons', () => {
    renderField();

    expect(screen.getByRole('button', { name: 'Choisir des images' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ajouter une URL vide' })).toBeInTheDocument();
  });

  it('adds an empty URL input when Ajouter une URL vide is clicked', async () => {
    const user = userEvent.setup();
    renderField();

    await user.click(screen.getByRole('button', { name: 'Ajouter une URL vide' }));

    expect(screen.getAllByPlaceholderText(/https:\/\/res\.cloudinary/)).toHaveLength(1);
  });

  it('calls onChangeImage when a URL is typed in a gallery input', async () => {
    const user = userEvent.setup();
    const { onChangeImage } = renderField();

    await user.click(screen.getByRole('button', { name: 'Ajouter une URL vide' }));

    const [input] = screen.getAllByPlaceholderText(/https:\/\/res\.cloudinary/);
    await user.type(input, 'https://example.com/image.png');

    expect(onChangeImage).toHaveBeenCalled();
  });
});
