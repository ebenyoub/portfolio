import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('../hooks/useAuth', () => ({ default: vi.fn(() => ({ logout: vi.fn(), token: null, user: null, isAuthenticated: false, login: vi.fn() })) }));

Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: vi.fn(() => 'blob:local-preview'),
});

Object.defineProperty(URL, 'revokeObjectURL', {
  writable: true,
  value: vi.fn(),
});

Element.prototype.scrollIntoView = vi.fn();
