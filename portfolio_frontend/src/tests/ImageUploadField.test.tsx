import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import ImageUploadField from '../components/ImageUploadField';

const renderField = (initialValue = '') => {
  const onChange = vi.fn();
  const onFileSelect = vi.fn();

  const Harness = () => {
    const [value, setValue] = useState(initialValue);

    return (
      <ImageUploadField
        id="image_url"
        label="Image de couverture"
        value={value}
        onChange={(nextValue) => {
          onChange(nextValue);
          setValue(nextValue);
        }}
        onFileSelect={onFileSelect}
      />
    );
  };

  const renderResult = render(<Harness />);

  return { ...renderResult, onChange, onFileSelect };
};

describe('ImageUploadField', () => {
  it('renders an accessible URL input labeled with the field label', () => {
    renderField();

    const input = screen.getByLabelText('Image de couverture');
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe('INPUT');
  });

  it('calls onChange when a URL is typed in the input', async () => {
    const user = userEvent.setup();
    const { onChange } = renderField();

    const input = screen.getByLabelText('Image de couverture');
    await user.type(input, 'https://example.com/cover.png');

    expect(onChange).toHaveBeenCalled();
  });

  it('renders a Choisir button to open the media picker', () => {
    renderField();

    expect(screen.getByRole('button', { name: 'Choisir' })).toBeInTheDocument();
  });

  it('shows a Retirer button and preview when a value is set', () => {
    const { container } = renderField('https://res.cloudinary.com/demo/image/upload/cover.webp');

    expect(screen.getByRole('button', { name: 'Retirer' })).toBeInTheDocument();
    expect(container.querySelector('img')).toBeInTheDocument();
  });

  it('calls onChange with empty string when Retirer is clicked', async () => {
    const user = userEvent.setup();
    const { onChange } = renderField('https://res.cloudinary.com/demo/image/upload/cover.webp');

    await user.click(screen.getByRole('button', { name: 'Retirer' }));

    expect(onChange).toHaveBeenCalledWith('');
  });
});
