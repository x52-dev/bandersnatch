import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { VideosModule } from './modules/videos/videos.module';
@Module({
  imports: [
    // 1. Initialize ConfigModule with strict Joi validation
    ConfigModule.forRoot({
      isGlobal: true, // Available everywhere without importing
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        FRONTEND_URL: Joi.string().required(),
        MONGODB_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().default('1d'),
      }),
    }),
    
    // 2. Async Mongoose initialization using ConfigService
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    
    AuthModule,
    UsersModule,
    VideosModule, 
  ],
})
export class AppModule {}