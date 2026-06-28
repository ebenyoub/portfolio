import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ProjectForm, { type ProjectFormValues, type ProjectPayload } from '../components/ProjectForm';
import { defaultProjectDisplaySettings } from '../types/project';

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

describe('ProjectForm submit flow', () => {
  it('submits existing URLs without modification on edit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(async () => undefined);
    renderProjectForm(onSubmit, validDefaultValues);

    await user.click(screen.getByRole('button', { name: 'Créer le projet' }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      image_url: validDefaultValues.image_url,
      gallery_images: ['https://res.cloudinary.com/demo/image/upload/existing-gallery.webp'],
    }));
  });

  it('does not submit when required fields are missing', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn<(_payload: ProjectPayload) => Promise<void>>();
    renderProjectForm(onSubmit);

    await user.click(screen.getByRole('button', { name: 'Créer le projet' }));

    await waitFor(() => expect(screen.getByText('Le titre doit faire au moins 3 caractères')).toBeInTheDocument());
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
