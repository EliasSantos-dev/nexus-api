import {
  BadRequestException,
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // (Crie este arquivo padrão do Prisma)
import { RedisService } from 'src/redis/redis.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async executeTransfer(dto: CreateTransactionDto, idempotencyKey: string) {
    // 1. Camada de Cache (Redis): Verifica se já processamos isso
    const cached = await this.redis.getCachedResponse(idempotencyKey);
    if (cached) {
      return { ...cached, _status: 'recovered_from_cache' };
    }

    // 2. Camada de Banco (Postgres): Garante unicidade persistente
    const existingTransfer = await this.prisma.transfer.findUnique({
      where: { idempotencyKey },
    });
    if (existingTransfer) {
      // Se existe no banco mas não no Redis (ex: Redis caiu), retorna o do banco
      await this.redis.cacheIdempotency(idempotencyKey, existingTransfer);
      return existingTransfer;
    }

    // 3. Transação ACID (Tudo ou Nada)
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        // Lock Otimista: Busca usuário e saldo
        const sender = await tx.user.findUnique({
          where: { id: dto.senderId },
        });

        if (!sender) throw new BadRequestException('Remetente não encontrado');
        if (sender.balance.toNumber() < dto.amount) {
          throw new BadRequestException('Saldo insuficiente');
        }

        // Operações de Débito e Crédito
        await tx.user.update({
          where: { id: dto.senderId },
          data: { balance: { decrement: dto.amount } },
        });

        await tx.user.update({
          where: { id: dto.receiverId },
          data: { balance: { increment: dto.amount } },
        });

        // Registro do Histórico
        return await tx.transfer.create({
          data: {
            amount: dto.amount,
            senderId: dto.senderId,
            receiverId: dto.receiverId,
            idempotencyKey,
            status: 'COMPLETED',
          },
        });
      });

      // 4. Salva sucesso no Cache
      await this.redis.cacheIdempotency(idempotencyKey, result);
      return result;

    } catch (error) {
        // Tratamento de erro específico
        if (error instanceof BadRequestException) throw error;
        console.error(error);
        throw new InternalServerErrorException('Falha no processamento da transação');
    }
  }
}