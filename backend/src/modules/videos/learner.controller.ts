import { Controller, Get, Param, Request, Put, UseGuards, NotFoundException, Post, Body } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Video } from './schemas/video.schema';
import { Progress } from '../progress/schemas/progress.schema';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { VideosService } from './videos.service';

@Controller('learner/videos')
@UseGuards(RolesGuard)
@Roles(UserRole.LEARNER) // Strictly for Learners
export class LearnerController {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<Video>,
    @InjectModel(Progress.name) private progressModel: Model<Progress>,
    private videosService: VideosService
  ) {}

  // 1. THIS WAS MISSING: Handles GET /api/learner/videos
  @Get()
  async getAssignedVideos(@Request() req) {
    const userId = new Types.ObjectId(req.user.sub);
    
    // Fetch all videos assigned to this learner
    const videos = await this.videoModel.find({ 
      isPublished: true, 
      assignedTo: userId 
    })
    .select('-questions.correctAnswers')
    .sort({ createdAt: -1 })
    .lean();
    
    // Fetch progress for these videos to show "Resume" status on dashboard
    const progresses = await this.progressModel.find({ userId }).lean();
    
    // Merge progress into video objects
    return videos.map(v => ({
      ...v,
      progress: progresses.find(p => p.videoId.toString() === v._id.toString()) || null
    }));
  }

  // 2. Handles GET /api/learner/videos/:id
  @Get(':id')
  async getVideoDetails(@Param('id') id: string, @Request() req) {
    const userId = new Types.ObjectId(req.user.sub);
    const videoId = new Types.ObjectId(id);

    const video = await this.videoModel.findOne({ 
      _id: videoId, 
      isPublished: true, 
      assignedTo: userId 
    })
    .select('-questions.correctAnswers')
    .lean();
    
    if (!video) throw new NotFoundException('Video not found or not assigned to you');

    const progress = await this.progressModel.findOne({ videoId, userId }).lean();
    return { video, progress };
  }

  @Put(':id/progress')
  async updateProgress(@Param('id') id: string, @Body() body: { currentTime: number, duration: number }, @Request() req) {
    return this.videosService.saveProgress(id, req.user.sub, body.currentTime, body.duration);
  }

  @Post(':id/check')
  async checkAnswer(@Param('id') id: string, @Body('timestamp') timestamp: number, @Body('answer') answer: string, @Request() req) {
    return this.videosService.checkAnswer(id, timestamp, answer, req.user.sub);
  }
}