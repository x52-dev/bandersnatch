import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VideosController } from './videos.controller';
import { LearnerController } from './learner.controller';
import { VideosService } from './videos.service';
import { Video, VideoSchema } from './schemas/video.schema';
import { Progress, ProgressSchema } from '../progress/schemas/progress.schema';
import { StorageModule } from '../storage/storage.module';
@Module({
  imports: [
    // Register the schemas so VideosService and LearnerController can inject them
    MongooseModule.forFeature([
      { name: Video.name, schema: VideoSchema },
      { name: Progress.name, schema: ProgressSchema }
    ]),
    StorageModule,
  ],
  controllers: [
    VideosController, 
    LearnerController
  ],
  providers: [VideosService],
  exports: [VideosService] // Exported so other modules (like UsersModule) can use it if needed
})
export class VideosModule {}