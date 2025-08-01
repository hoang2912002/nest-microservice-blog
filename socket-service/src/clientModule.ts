// src/client-proxy/client-proxy.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { USER_SERVICE } from './constants';

@Module({
  imports: [
    ClientsModule.registerAsync([
        {
          name: USER_SERVICE,
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory:(configService: ConfigService) => ({
              transport: Transport.REDIS,
              options: {
              host: configService.get<string>('REDIS_HOST'),
              port: configService.get<number>('REDIS_PORT') || 6379,
              },
          }),
        },
    ]),
  ],
  exports: [ClientsModule], // Xuất để các module khác sử dụng
})
export class ClientProxyModule {}
