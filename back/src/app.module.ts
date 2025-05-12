import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './entities/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { SessionMiddleware } from './middleware/session.middleware';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { ChatsModule } from './entities/chats/chats.module';
import { MessagesModule } from './entities/messages/messages.module';
import { ChatmembersModule } from './entities/chatmembers/chatmembers.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'webchatdb',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ChatsModule,
    MessagesModule,
    ChatmembersModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
    AppService,
  ],
})
export class AppModule {
  // Endpoints that require a user to be logged in before being able to access
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SessionMiddleware)
      .forRoutes(
        'auth/logout',
        'api/users/me',
        'api/chats',
        'api/messages',
        'api/users/admin' // TESTING
      );
  }
}
