// src/client-proxy/client-proxy.module.ts
import { createKeyv, Keyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheableMemory } from 'cacheable';

@Module({
  imports: [
    CacheModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
            return {
            stores: [
                new Keyv({
                store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
                }),
                createKeyv(configService.get<string>('REDIS_URL')),
            ],
            };
        },
    }),
  ],
  exports: [CacheModule], // Xuất để các module khác sử dụng
})
export class CacheProxyModule {}
