import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import Account from './Account';

vi.mock('axios');

vi.mock('../api/auth', () => ({
  getToken: () => 'token',
  getStoredProfile: () => null,
  setStoredProfile: vi.fn(),
  logout: vi.fn(),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Account Page', () => {
  beforeEach(() => {
    mockedAxios.get.mockReset();
    mockedAxios.put.mockReset();
  });

  test('SSIMS-PROFILE-004 loads and saves the picked profile image file', async () => {
    mockedAxios.get.mockResolvedValue({
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

    expect(await screen.findByAltText(/profile preview/i)).toBeInTheDocument();

    const fileInput = screen.getByLabelText(/profile image file/i, {
      selector: 'input',
    });

    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
    const originalFileReader = globalThis.FileReader;
    class MockFileReader {
      result: string | null = null;
      onload: ((event: ProgressEvent<FileReader>) => void) | null = null;

      readAsDataURL() {
        this.result = 'data:image/png;base64,new-avatar';
        this.onload?.(new ProgressEvent('load') as ProgressEvent<FileReader>);
      }
    }

    // @ts-expect-error test shim
    globalThis.FileReader = MockFileReader;

    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(screen.getByRole('button', { name: /save profile/i }));

    await waitFor(() => {
      expect(mockedAxios.put).toHaveBeenCalledWith(
        'http://localhost:3000/users/update-profile',
        {
          username: 'admin',
          profileImage: 'data:image/png;base64,new-avatar',
        },
        {
          headers: {
            Authorization: 'Bearer token',
          },
        },
      );
    });

    globalThis.FileReader = originalFileReader;
  });
});
