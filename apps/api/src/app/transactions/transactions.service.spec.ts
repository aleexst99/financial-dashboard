import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { TransactionEntity, TransactionType } from './entities/transaction.entity';

describe('TransactionsService', () => {
  let service: TransactionsService;
  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(TransactionEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a transaction scoped to the given userId', async () => {
    const dto = {
      amount: 45.5,
      type: TransactionType.EXPENSE,
      category: 'food',
      date: '2026-09-01',
    };
    mockRepository.create.mockReturnValue({ ...dto, userId: 'user-1' });
    mockRepository.save.mockResolvedValue({ id: '1', ...dto, userId: 'user-1' });

    await service.create('user-1', dto);

    expect(mockRepository.create).toHaveBeenCalledWith({ ...dto, userId: 'user-1' });
  });
});