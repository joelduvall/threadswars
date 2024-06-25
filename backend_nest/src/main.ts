import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      enableDebugMessages: true,
      disableErrorMessages: false,
    }),
  );
  await app.listen(3080);
}
bootstrap();
