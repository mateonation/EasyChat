process.env.TZ = 'UTC';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as sharedSession from 'express-socket.io-session';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'secret-word',
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
    cookie: {
      secure: false, // true if using HTTPS
      sameSite: 'lax', // 'strict' for more security, 'lax' for better compatibility
      httpOnly: true,  // Prevent JavaScript access to cookies
      maxAge: 1000 * 60 * 60 * 24 * 7, // Expires in 7 days
    },
  })

  app.use(cookieParser());
  app.use(sessionMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());

  class SessionIOAdapter extends IoAdapter {
    createIOServer(
      port: number,
      options?: any
    ): any {
      const server = super.createIOServer(port, options);
      server.use(
        sharedSession(sessionMiddleware, {
          autoSave: true,
        }),
      );
      return server;
    }
  }

  app.useWebSocketAdapter(new SessionIOAdapter(app));

  // Enable CORS for the frontend
  app.enableCors({
    origin: 'http://localhost:5173', // frontend URL
    credentials: true, // Allow cookies to be sent
  });

  // Global pipes for validation
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Automatically transform payloads to DTO instances
    whitelist: true, // Strip properties not in the DTO
    forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are found
  }));

  await app.listen(3000);
}
bootstrap();
