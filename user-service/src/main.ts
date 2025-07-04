import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const transportTCP = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,
    {
      transport:Transport.TCP,
      options:{
        host:process.env.TCP_HOST,
        port:process.env.TCP_PORT ? parseInt(process.env.TCP_PORT) : 8001,
      }
    },
  );
  const transportREDIS = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,
    {
      transport:Transport.REDIS,
      options:{
        host:process.env.REDIS_HOST,
        port:process.env.REDIS_PORT ? +process.env.REDIS_PORT : undefined,
      }
    },
  );
  await Promise.all([transportTCP.listen(),transportREDIS.listen()])
  console.log("User service running in port 8001")
}
bootstrap();
