import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const authService = {
    login: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should forward register requests to auth service', async () => {
    authService.register.mockResolvedValue({
      message: 'Registration successful',
    });

    const result = await controller.register({
      username: 'newuser',
      password: 'secret123',
    });

    expect(authService.register).toHaveBeenCalledWith('newuser', 'secret123');
    expect(result).toEqual({ message: 'Registration successful' });
  });
});
