import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Deixa o banco disponível no app todo
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}