import { IsEnum, IsNumber, IsString, IsDateString, IsOptional, Min } from 'class-validator';
import { TransactionType } from '../entities/transaction.entity';

export class CreateTransactionDto {
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  date: string;
}