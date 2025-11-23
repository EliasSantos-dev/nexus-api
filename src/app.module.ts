import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './redis/redis.module';
import { TransactionsModule } from './transactions/transactions.module';
import { PrismaModule } from './prisma/prisma.module';
import { ClientsModule } from './clients/clients.module';

@Module({
  imports: [RedisModule, TransactionsModule, PrismaModule, ClientsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
