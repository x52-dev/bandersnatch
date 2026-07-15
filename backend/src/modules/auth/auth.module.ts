import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    // Provide the User model to this module
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    // Configure JWT
    JwtModule.register({
      global: true, // Makes it available everywhere without re-importing
      secret: 'my-super-secret-jwt-key', // In production, move this to an environment variable!
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}