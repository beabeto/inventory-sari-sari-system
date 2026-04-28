// src/pages/Login.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';

describe('Login Page', () => {
  test('renders login text', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Checks if "Login" button exists
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument();
  });
});
