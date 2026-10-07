import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('hashes the password before saving a new user', async () => {
    mockRepository.create.mockReturnValue({ email: 'test@test.com' });
    mockRepository.save.mockResolvedValue({ id: '1', email: 'test@test.com' });

    await service.create('test@test.com', 'plainPassword123', 'Test');

    const savedArg = mockRepository.create.mock.calls[0][0];
    expect(savedArg.password).not.toBe('plainPassword123');
    expect(savedArg.password).toMatch(/^\$2b\$/);
  });
});