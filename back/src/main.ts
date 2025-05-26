import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as sharedSession from 'express-socket.io-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const sessionMiddleware = session({
    secret: 'secret-word', // Replace with a strong secret
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
    cookie: { secure: false, sameSite: 'lax' }, // Set to true if using HTTPS and adjust sameSite as needed
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
      server.use(sharedSession(sessionMiddleware, {
        autoSave: true,
      }));
      return server;
    }
  }

  app.useWebSocketAdapter(new SessionIOAdapter(app));

  // Enable CORS for the frontend
  app.enableCors({
    origin: 'http://localhost:5173', // frontend URL
    credentials: true, // Allow cookies to be sent
  });

  await app.listen(3000);
}
bootstrap();
