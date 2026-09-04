import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { QueryTransactionDto } from './dto/query-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionsRepository: Repository<TransactionEntity>,
  ) {}

  async create(userId: string, dto: CreateTransactionDto): Promise<TransactionEntity> {
    const transaction = this.transactionsRepository.create({
      ...dto,
      userId,
    });

    return this.transactionsRepository.save(transaction);
  }

  async findAllForUser(userId: string, query: QueryTransactionDto) {
    const { type, category, startDate, endDate, page = 1, limit = 10 } = query;

    const qb = this.transactionsRepository
      .createQueryBuilder('transaction')
      .where('transaction.userId = :userId', { userId });

    if (type) {
      qb.andWhere('transaction.type = :type', { type });
    }

    if (category) {
      qb.andWhere('transaction.category = :category', { category });
    }

    if (startDate) {
      qb.andWhere('transaction.date >= :startDate', { startDate });
    }

    if (endDate) {
      qb.andWhere('transaction.date <= :endDate', { endDate });
    }

    qb.orderBy('transaction.date', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}