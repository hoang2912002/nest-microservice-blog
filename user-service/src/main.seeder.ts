// src/main.seeder.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserSeeder } from './user/entities/user.seed';

//npx ts-node src/main.seeder.ts
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seeder = app.get(UserSeeder);
  await seeder.seed(100);
  await app.close();
}

bootstrap();
