import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const transportTCP = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,
    {
      transport:Transport.TCP,
      options:{
        host:process.env.TCP_HOST,
        port:process.env.TCP_PORT ? +process.env.TCP_PORT : undefined,
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
  const app = await NestFactory.create(AppModule)
  app.use(cookieParser());
  app.enableCors(
  {
    "origin": true,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    credentials: true
  })

  await Promise.all(
    [
      transportTCP.listen(),
      transportREDIS.listen(),
      app.listen(process.env.PORT ?? 8003)
    ]
  )
  console.log("Product service running in port 8002")
}
bootstrap();
