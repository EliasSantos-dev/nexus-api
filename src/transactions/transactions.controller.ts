import { Body, Controller, Get, Headers, Param, Post, HttpException } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Transações')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Processa transferência entre contas' })
  @ApiHeader({
    name: 'Idempotency-Key',
    description: 'UUID único para garantir que a transação seja processada apenas uma vez',
    required: true,
  })
  async create(
    @Body() dto: CreateTransactionDto,
    @Headers('Idempotency-Key') idempotencyKey: string,
  ) {
    if (!idempotencyKey) throw new HttpException('Idempotency-Key header is missing', 400);
    return this.service.executeTransfer(dto, idempotencyKey);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Busca o extrato do usuário' })
  findAll(@Param('userId') userId: string) {
    return this.service.findAllByUser(userId);
  }
}