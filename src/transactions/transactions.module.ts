import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PrismaModule } from 'src/prisma/prisma.module'; // Certifique-se que existe
// Se você usou @Global() no passo 1, não precisa importar o RedisModule aqui.
// Se NÃO usou @Global(), descomente a linha abaixo:
// import { RedisModule } from 'src/redis/redis.module'; 

@Module({
  imports: [
    PrismaModule, // Para usar o PrismaService
    // RedisModule, // Descomente se não usou @Global() no RedisModule
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}