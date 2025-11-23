import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';

// Dica Sênior: @Global() faz com que você não precise importar o RedisModule 
// em todos os lugares (opcional, mas muito útil para módulos de infraestrutura)
@Global() 
@Module({
  providers: [RedisService],
  exports: [RedisService], // <--- OBRIGATÓRIO: Exportar para que outros usem
})
export class RedisModule {}