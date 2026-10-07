import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  const mockUsersService = {
    update: jest.fn(),
    changePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('strips sensitive fields from the updateProfile response', async () => {
    mockUsersService.update.mockResolvedValue({
      id: '1',
      email: 'test@test.com',
      name: 'Test',
      password: 'hashed-should-not-leak',
      hashedRefreshToken: 'should-not-leak-either',
    });

    const req = { user: { id: '1' } };
    const result = await controller.updateProfile(req, { name: 'Test' });

    expect(result).toEqual({ id: '1', email: 'test@test.com', name: 'Test' });
    expect(result).not.toHaveProperty('password');
    expect(result).not.toHaveProperty('hashedRefreshToken');
  });
});
