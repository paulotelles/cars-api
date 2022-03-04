import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
}
bootstrap();
