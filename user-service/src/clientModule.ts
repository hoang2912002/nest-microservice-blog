// src/client-proxy/client-proxy.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCT_SERVICE, SOCKET_SERVICE } from './constants';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
        {
        name: PRODUCT_SERVICE,
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
    ClientsModule.registerAsync([
        {
        name: SOCKET_SERVICE,
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
