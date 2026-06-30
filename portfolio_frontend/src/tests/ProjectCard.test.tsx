import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ProjectCard from '../components/ProjectCard';

const defaults = {
  id: 1,
  title: 'React Calculator',
  description: 'A calculator built with React.',
  onOpenDetail: vi.fn(),
};

describe('ProjectCard', () => {
  it('renders title, description and calls onOpenDetail when clicked', async () => {
    const user = userEvent.setup();
    const onOpenDetail = vi.fn();
    render(<ProjectCard {...defaults} onOpenDetail={onOpenDetail} />);

    expect(screen.getByRole('heading', { name: 'React Calculator' })).toBeInTheDocument();
    expect(screen.getByText('A calculator built with React.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Voir le detail de React Calculator/i }));
    expect(onOpenDetail).toHaveBeenCalledTimes(1);
  });

  it('shows the cover image when image_url is provided', () => {
    render(<ProjectCard {...defaults} image_url="https://example.com/cover.png" />);
    expect(screen.getByAltText('React Calculator')).toHaveAttribute('src', 'https://example.com/cover.png');
  });

  it('falls back to the title placeholder when the image fails to load', () => {
    render(<ProjectCard {...defaults} image_url="https://example.com/broken.png" />);
    const img = screen.getByAltText('React Calculator');
    fireEvent.error(img);
    // The placeholder div with the title should now be visible
    expect(screen.getAllByText('React Calculator').length).toBeGreaterThan(0);
    expect(screen.queryByAltText('React Calculator')).not.toBeInTheDocument();
  });

  it('renders tech stack badges and collapses to +N when more than 4 techs', () => {
    render(<ProjectCard {...defaults} tech_stack="React, TS, CSS, Vitest, Docker" />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TS')).toBeInTheDocument();
    expect(screen.getByText('+1')).toBeInTheDocument();
    // The 5th tech must not be rendered individually
    expect(screen.queryByText('Docker')).not.toBeInTheDocument();
  });

  it('renders github and demo links only when provided, with stopPropagation', async () => {
    const user = userEvent.setup();
    const onOpenDetail = vi.fn();
    render(
      <ProjectCard
        {...defaults}
        onOpenDetail={onOpenDetail}
        github_url="https://github.com/test/repo"
        demo_url="https://demo.example.com"
      />
    );

    const githubLink = screen.getByRole('link', { name: 'GitHub' });
    expect(githubLink).toHaveAttribute('href', 'https://github.com/test/repo');

    const demoLink = screen.getByRole('link', { name: /Ouvrir la démo/i });
    expect(demoLink).toHaveAttribute('href', 'https://demo.example.com');

    // Clicking the demo link must not bubble up to onOpenDetail
    await user.click(demoLink);
    expect(onOpenDetail).not.toHaveBeenCalled();
  });
});
