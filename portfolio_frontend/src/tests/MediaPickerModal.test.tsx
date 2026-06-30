import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { toast } from 'sonner';
import MediaPickerModal from '../components/MediaPickerModal';
import useFetch from '../hooks/apiFetch';

vi.mock('../hooks/apiFetch', () => ({ default: vi.fn() }));
vi.mock('../services/cloudinary');
vi.mock('sonner', () => ({
  toast: { error: vi.fn(), loading: vi.fn().mockReturnValue('toast-id'), success: vi.fn() },
}));

const mockUseFetch = vi.mocked(useFetch);

const mockMedia = {
  id: 1,
  name: 'cover.png',
  url: 'https://res.cloudinary.com/demo/cover.png',
  created_at: '2024-01-15T10:00:00Z',
};

const setup = (overrides: Partial<{ isOpen: boolean }> = {}) => {
  const onClose = vi.fn();
  const onSelect = vi.fn();
  mockUseFetch.mockReturnValue({
    apiFetch: vi.fn().mockResolvedValue({ data: [mockMedia] }),
    isLoading: false,
  });
  render(
    <MediaPickerModal
      isOpen={overrides.isOpen ?? true}
      onClose={onClose}
      onSelect={onSelect}
    />
  );
  return { onClose, onSelect };
};

describe('MediaPickerModal', () => {
  it('renders nothing when isOpen is false', () => {
    mockUseFetch.mockReturnValue({ apiFetch: vi.fn(), isLoading: false });
    const { container } = render(
      <MediaPickerModal isOpen={false} onClose={vi.fn()} onSelect={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('fetches medias on open and displays them in the library grid', async () => {
    setup();
    await waitFor(() =>
      expect(screen.getByAltText('cover.png')).toBeInTheDocument()
    );
    expect(screen.getByRole('heading', { name: 'Sélectionner un média' })).toBeInTheDocument();
  });

  it('calls onClose when the Escape key is pressed', async () => {
    const user = userEvent.setup();
    const { onClose } = setup();
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the × header button is clicked', async () => {
    const user = userEvent.setup();
    const { onClose } = setup();
    await user.click(screen.getByRole('button', { name: 'Fermer' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the overlay backdrop is clicked', async () => {
    const user = userEvent.setup();
    const { onClose } = setup();
    const backdrop = document.querySelector('.absolute.inset-0') as HTMLElement;
    await user.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows a loading indicator while medias are being fetched', () => {
    mockUseFetch.mockReturnValue({
      apiFetch: vi.fn().mockReturnValue(new Promise(() => {})),
      isLoading: true,
    });
    render(<MediaPickerModal isOpen={true} onClose={vi.fn()} onSelect={vi.fn()} />);
    expect(screen.getByText('Chargement des médias...')).toBeInTheDocument();
  });

  it('calls toast.error when the media fetch fails', async () => {
    mockUseFetch.mockReturnValue({
      apiFetch: vi.fn().mockRejectedValue(new Error('Réseau indisponible')),
      isLoading: false,
    });
    render(<MediaPickerModal isOpen={true} onClose={vi.fn()} onSelect={vi.fn()} />);
    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Réseau indisponible')
    );
  });

  it('shows the empty state when no medias are returned', async () => {
    mockUseFetch.mockReturnValue({
      apiFetch: vi.fn().mockResolvedValue({ data: [] }),
      isLoading: false,
    });
    render(<MediaPickerModal isOpen={true} onClose={vi.fn()} onSelect={vi.fn()} />);
    await waitFor(() =>
      expect(screen.getByText('Aucun média trouvé')).toBeInTheDocument()
    );
  });

  it('filters the grid to matching medias when the search input is used', async () => {
    const user = userEvent.setup();
    mockUseFetch.mockReturnValue({
      apiFetch: vi.fn().mockResolvedValue({
        data: [
          { id: 1, name: 'cover.png', url: 'https://example.com/cover.png', created_at: '2024-01-01' },
          { id: 2, name: 'banner.jpg', url: 'https://example.com/banner.jpg', created_at: '2024-01-02' },
        ],
      }),
      isLoading: false,
    });
    render(<MediaPickerModal isOpen={true} onClose={vi.fn()} onSelect={vi.fn()} />);

    await waitFor(() => expect(screen.getByAltText('cover.png')).toBeInTheDocument());

    await user.type(screen.getByPlaceholderText('Rechercher par nom...'), 'banner');

    expect(screen.queryByAltText('cover.png')).not.toBeInTheDocument();
    expect(screen.getByAltText('banner.jpg')).toBeInTheDocument();
  });

  it('calls onSelect with the image URL and then onClose when "Utiliser cette image" is clicked', async () => {
    const user = userEvent.setup();
    const { onClose, onSelect } = setup();

    // Wait for media to load and appear in the grid
    await waitFor(() => expect(screen.getByAltText('cover.png')).toBeInTheDocument());

    // Select the item (click on the grid card — the div wrapping the img has onClick)
    await user.click(screen.getByAltText('cover.png'));

    // Confirm selection
    await user.click(screen.getByRole('button', { name: /Utiliser cette image/i }));

    expect(onSelect).toHaveBeenCalledWith('https://res.cloudinary.com/demo/cover.png');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
