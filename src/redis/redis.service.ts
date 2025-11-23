import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  onModuleInit() {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      throw new Error('REDIS_URL environment variable is not defined');
    }
    this.client = new Redis(redisUrl);
  }

  onModuleDestroy() {
    this.client.disconnect();
  }

  // Salva o resultado de uma transação por 24h
  async cacheIdempotency(key: string, data: any) {
    await this.client.set(
      `idempotency:${key}`,
      JSON.stringify(data),
      'EX',
      60 * 60 * 24, // 24 horas
    );
  }

  async getCachedResponse(key: string) {
    const data = await this.client.get(`idempotency:${key}`);
    return data ? JSON.parse(data) : null;
  }
}