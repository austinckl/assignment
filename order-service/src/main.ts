import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
// import { AllExceptionsFilter } from './all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    },
  });
  await app.startAllMicroservicesAsync();

  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(3000);
}
bootstrap();
