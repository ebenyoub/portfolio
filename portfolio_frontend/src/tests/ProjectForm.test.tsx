import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProjectForm, { type ProjectFormValues, type ProjectPayload } from '../components/ProjectForm';
import { defaultProjectDisplaySettings } from '../types/project';
import { uploadImageToCloudinary } from '../services/cloudinary';

vi.mock('../services/cloudinary', () => ({
  uploadImageToCloudinary: vi.fn(),
}));

const uploadImageToCloudinaryMock = vi.mocked(uploadImageToCloudinary);

const coverFile = new File(['cover'], 'cover.png', { type: 'image/png' });
const galleryFile = new File(['gallery'], 'gallery.png', { type: 'image/png' });

const validDefaultValues: ProjectFormValues = {
  title: 'Projet existant',
  description: 'Description existante assez longue',
  tech_stack: 'React, TypeScript',
  github_url: 'https://github.com/elyas/project',
  demo_url: 'https://example.com',
  image_url: 'https://res.cloudinary.com/demo/image/upload/existing-cover.webp',
  gallery_images: [
    { url: 'https://res.cloudinary.com/demo/image/upload/existing-gallery.webp' },
  ],
  context: '',
  objective: '',
  challenges: '',
  solution: '',
  learned_skills: '',
  display_settings: defaultProjectDisplaySettings,
};

const renderProjectForm = (onSubmit = vi.fn<(_payload: ProjectPayload) => Promise<void>>(), defaultValues?: ProjectFormValues) => {
  render(
    <ProjectForm
      defaultValues={defaultValues}
      submitLabel="Créer le projet"
      loadingLabel="Création..."
      onSubmit={onSubmit}
      onCancel={vi.fn()}
    />
  );

  return { onSubmit };
};

const fillRequiredFields = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText(/Titre du projet/), 'Nouveau projet');
  await user.type(screen.getByLabelText(/Description courte/), 'Une description suffisamment longue.');
};

describe('ProjectForm Cloudinary submit flow', () => {
  beforeEach(() => {
    uploadImageToCloudinaryMock.mockReset();
  });

  it('does not upload selected files before submit', async () => {
    const user = userEvent.setup();
    renderProjectForm();

    await fillRequiredFields(user);
    await user.upload(screen.getByLabelText('Sélectionner Image de couverture'), coverFile);
    await user.upload(screen.getByLabelText('Sélectionner les images du carousel'), galleryFile);

    expect(uploadImageToCloudinaryMock).not.toHaveBeenCalled();
  });

  it('does not call Cloudinary when the form is invalid', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn<(_payload: ProjectPayload) => Promise<void>>();
    renderProjectForm(onSubmit);

    await user.upload(screen.getByLabelText('Sélectionner Image de couverture'), coverFile);
    await user.click(screen.getByRole('button', { name: 'Créer le projet' }));

    await waitFor(() => expect(screen.getByText('Le titre doit faire au moins 3 caractères')).toBeInTheDocument());
    expect(uploadImageToCloudinaryMock).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('uploads selected files then saves the project payload', async () => {
    const user = userEvent.setup();
    const callOrder: string[] = [];
    const onSubmit = vi.fn(async () => {
      callOrder.push('save');
    });
    uploadImageToCloudinaryMock
      .mockImplementationOnce(async () => {
        callOrder.push('upload-cover');
        return { secure_url: 'https://res.cloudinary.com/demo/image/upload/cover.webp', public_id: 'cover' };
      })
      .mockImplementationOnce(async () => {
        callOrder.push('upload-gallery');
        return { secure_url: 'https://res.cloudinary.com/demo/image/upload/gallery.webp', public_id: 'gallery' };
      });
    renderProjectForm(onSubmit);

    await fillRequiredFields(user);
    await user.upload(screen.getByLabelText('Sélectionner Image de couverture'), coverFile);
    await user.upload(screen.getByLabelText('Sélectionner les images du carousel'), galleryFile);
    await user.click(screen.getByRole('button', { name: 'Créer le projet' }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(callOrder).toEqual(['upload-cover', 'upload-gallery', 'save']);
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      image_url: 'https://res.cloudinary.com/demo/image/upload/cover.webp',
      gallery_images: ['https://res.cloudinary.com/demo/image/upload/gallery.webp'],
    }));
  });

  it('does not save when Cloudinary upload fails', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn<(_payload: ProjectPayload) => Promise<void>>();
    uploadImageToCloudinaryMock.mockRejectedValueOnce(new Error('Upload Cloudinary impossible.'));
    renderProjectForm(onSubmit);

    await fillRequiredFields(user);
    await user.upload(screen.getByLabelText('Sélectionner Image de couverture'), coverFile);
    await user.click(screen.getByRole('button', { name: 'Créer le projet' }));

    await waitFor(() => expect(uploadImageToCloudinaryMock).toHaveBeenCalledTimes(1));
    expect(screen.getByText('Upload Cloudinary impossible.')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not re-upload existing URLs on edit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(async () => undefined);
    renderProjectForm(onSubmit, validDefaultValues);

    await user.click(screen.getByRole('button', { name: 'Créer le projet' }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(uploadImageToCloudinaryMock).not.toHaveBeenCalled();
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      image_url: validDefaultValues.image_url,
      gallery_images: ['https://res.cloudinary.com/demo/image/upload/existing-gallery.webp'],
    }));
  });
});
