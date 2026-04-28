import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const usersService = {
    getMe: jest.fn(),
    updateProfile: jest.fn(),
    changePassword: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('SSIMS-PROFILE-002 returns profile image data from getMe', async () => {
    usersService.getMe.mockResolvedValue({
      id: 1,
      username: 'admin',
      role: 'admin',
      profileImage: 'https://example.com/avatar.png',
    });

    const result = await controller.getMe({
      user: { userId: 1 },
    });

    expect(usersService.getMe).toHaveBeenCalledWith(1);
    expect(result).toEqual({
      id: 1,
      username: 'admin',
      role: 'admin',
      profileImage: 'https://example.com/avatar.png',
    });
  });

  it('SSIMS-PROFILE-003 forwards username and profile image updates', async () => {
    usersService.updateProfile.mockResolvedValue({
      message: 'Profile updated successfully',
    });

    const result = await controller.updateProfile(
      { user: { userId: 1 } },
      {
        username: 'admin',
        profileImage: 'https://example.com/avatar.png',
      },
    );

    expect(usersService.updateProfile).toHaveBeenCalledWith(
      1,
      'admin',
      'https://example.com/avatar.png',
    );
    expect(result).toEqual({
      message: 'Profile updated successfully',
    });
  });
});
