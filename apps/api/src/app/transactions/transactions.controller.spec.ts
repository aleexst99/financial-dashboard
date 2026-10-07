import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionType } from './entities/transaction.entity';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  const mockTransactionsService = {
    create: jest.fn(),
    findAllForUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsService,
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('passes the authenticated userId from the request, not from the body', async () => {
    const req = { user: { id: 'user-from-token' } };
    const dto = { amount: 10, type: TransactionType.EXPENSE, category: 'food', date: '2026-09-01' };

    await controller.create(req, dto);

    expect(mockTransactionsService.create).toHaveBeenCalledWith('user-from-token', dto);
  });
});