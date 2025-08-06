import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
// import { CustomHttpExceptionFilter } from './util/http-exception.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    bodyParser.json({ limit: '100mb' }),
    cookieParser());
  app.enableCors(
  {
    "origin": ['http://localhost:3000','http://localhost:3001'],
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    credentials: true
  }
  );
  // app.useGlobalFilters(new CustomHttpExceptionFilter());
  await app.listen(process.env.PORT ?? 8000);
  console.log("Api gateway running in port 8000")
}
bootstrap();
