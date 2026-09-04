import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { QueryTransactionDto } from './dto/query-transaction.dto';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Req() req, @Body() dto: CreateTransactionDto) {
    return this.transactionsService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Req() req, @Query() query: QueryTransactionDto) {
    return this.transactionsService.findAllForUser(req.user.id, query);
  }
}