import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 8000;
  await app.listen(port);

  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   LSHD1 Screening System - NestJS Backend             ║
║                                                       ║
║   Status: ✅ Running                                  ║
║   Port: ${port}                                          ║
║   API Base: http://localhost:${port}/api                 ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
}

bootstrap();
