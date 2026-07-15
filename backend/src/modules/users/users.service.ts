import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserRole } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // Fetch all learners, excluding their passwords for security
  async findAllLearners() {
    return this.userModel
      .find({ role: UserRole.LEARNER })
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .exec();
  }
}