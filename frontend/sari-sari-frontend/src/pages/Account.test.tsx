import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Account from './Account';

jest.mock('axios');

jest.mock('../api/auth', () => ({
  getToken: () => 'token',
  logout: jest.fn(),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Account Page', () => {
  beforeEach(() => {
    mockedAxios.get.mockReset();
    mockedAxios.put.mockReset();
  });

  test('SSIMS-PROFILE-004 loads and saves the profile image field', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        id: 1,
        username: 'admin',
        role: 'admin',
        profileImage: 'https://example.com/old-avatar.png',
      },
    });

    mockedAxios.put.mockResolvedValueOnce({
      data: {
        message: 'Profile updated successfully',
      },
    });

    render(
      <MemoryRouter>
        <Account />
      </MemoryRouter>,
    );

    const profileImageInput = await screen.findByPlaceholderText(/enter profile image url/i);
    expect(profileImageInput).toHaveValue('https://example.com/old-avatar.png');

    fireEvent.change(profileImageInput, {
      target: { value: 'https://example.com/new-avatar.png' },
    });

    fireEvent.click(screen.getByRole('button', { name: /save profile/i }));

    await waitFor(() => {
      expect(mockedAxios.put).toHaveBeenCalledWith(
        'http://localhost:3000/users/update-profile',
        {
          username: 'admin',
          profileImage: 'https://example.com/new-avatar.png',
        },
        {
          headers: {
            Authorization: 'Bearer token',
          },
        },
      );
    });
  });
});
