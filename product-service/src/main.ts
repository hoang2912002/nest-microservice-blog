import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,{
    transport:Transport.TCP,
    options:{
      host:process.env.TCP_HOST,
      port:process.env.TCP_PORT ? +process.env.TCP_PORT : undefined,
    }
  });
  await app.listen();
  console.log("Product service running in port 8002")
}
bootstrap();
