import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const transportREDIS = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,{
    transport: Transport.REDIS,
    options:{
      host:process.env.REDIS_HOST,
      port:process.env.REDIS_PORT ? +process.env.REDIS_PORT : undefined,
    }
  });
  await Promise.all([
    app.listen(process.env.PORT ?? 8004),
    transportREDIS.listen()
  ])
  // await app.listen(process.env.PORT ?? 8004);
  console.log('Socket io running in port 8004')
}
bootstrap();
