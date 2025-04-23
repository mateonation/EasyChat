import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: 'secret-word', // Replace with a strong secret
      resave: false, // Don't save session if unmodified
      saveUninitialized: false, // Don't create session until something stored
      cookie: { secure: false }, // Set to true if using HTTPS
    }),
  );

  app.enableCors({
    origin: 'http://localhost:5173', // frontend URL
    credentials: true, // Allow cookies to be sent
  });

  await app.listen(3000);
}
bootstrap();
