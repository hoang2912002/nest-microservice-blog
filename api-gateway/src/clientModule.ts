// src/client-proxy/client-proxy.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCT_SERVICE, USER_SERVICE } from './constants';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
        {
        name: USER_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory:(configService: ConfigService) => ({
            transport: Transport.TCP,
            options: {
            host: configService.get<string>('TCP_HOST'),
            port: configService.get<number>('TCP_PORT_USER_SERVICE') || 8001,
            retryAttempts: 5,   // 👈 thử lại 5 lần
            retryDelay: 3000,   // 👈 delay 3s mỗi lần thử
            },
        }),
        },
        // {
        // name: PRODUCT_SERVICE,
        // imports: [ConfigModule],
        // inject: [ConfigService],
        // useFactory:(configService: ConfigService) => ({
        //     transport: Transport.TCP,
        //     options: {
        //     host: configService.get<string>('TCP_HOST'),
        //     port: configService.get<number>('TCP_PORT_PRODUCT_SERVICE') || 8002,
        //     retryAttempts: 5,   // 👈 thử lại 5 lần
        //     retryDelay: 3000,   // 👈 delay 3s mỗi lần thử
        //     },
        // }),
        // },
    ]),
  ],
  exports: [ClientsModule], // Xuất để các module khác sử dụng
})
export class ClientProxyModule {}
