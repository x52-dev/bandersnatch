import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Video } from './schemas/video.schema';
import { Progress } from '../progress/schemas/progress.schema';
import { CreateVideoDto, UpdateVideoDto } from './dto/create-video.dto';

@Injectable()
export class VideosService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<Video>,
    @InjectModel(Progress.name) private progressModel: Model<Progress>,
  ) {}

  // Helper to prevent 500 errors on bad IDs
  private validateObjectId(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid identifier format: ${id}`);
    }
  }

  async create(createVideoDto: CreateVideoDto, adminId: string) {
    // If description is provided as an empty string, set it to undefined to trigger Schema default
    const processedDto = {
      ...createVideoDto,
      description: createVideoDto.description?.trim() ? createVideoDto.description : undefined,
    };

    const video = new this.videoModel({
      ...processedDto,
      createdBy: new Types.ObjectId(adminId),
    });
    
    return video.save();
  }

  async findAllAdmin(adminId: string) {
    // Sort by createdAt descending so newly processing videos appear at the top of the table
    return this.videoModel
      .find({ createdBy: new Types.ObjectId(adminId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(videoId: string, updateData: UpdateVideoDto, adminId: string) {
    this.validateObjectId(videoId);

    // Ensure the admin modifying the video is the one who created it
    const video = await this.videoModel.findOneAndUpdate(
      { _id: videoId, createdBy: new Types.ObjectId(adminId) },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!video) throw new NotFoundException('Video not found or you do not have permission to edit it');
    
    return video;
  }

  async togglePublish(videoId: string, isPublished: boolean, adminId: string) {
    this.validateObjectId(videoId);

    const video = await this.videoModel.findOneAndUpdate(
      { _id: videoId, createdBy: new Types.ObjectId(adminId) },
      { $set: { isPublished } },
      { new: true }
    );

    if (!video) throw new NotFoundException('Video not found');
    
    return video;
  }

  async findOneAdmin(videoId: string, adminId: string) {
    this.validateObjectId(videoId); // Fixed: Now uses your class helper
    
    const video = await this.videoModel.findOne({ _id: videoId, createdBy: new Types.ObjectId(adminId) }).exec();
    if (!video) throw new NotFoundException('Video not found or unauthorized');
    
    return video;
  }

  async getLearnerReports(videoId: string, adminId: string) {
    this.validateObjectId(videoId);

    // Ensure the admin requesting the report owns the video
    const video = await this.videoModel.findOne({ _id: videoId, createdBy: new Types.ObjectId(adminId) });
    if (!video) throw new NotFoundException('Video not found');

    return this.progressModel.find({ videoId: new Types.ObjectId(videoId) })
      .populate('userId', 'name email')
      .sort({ updatedAt: -1 })
      .exec();
  }

  // --- Consolidated & Fixed Assignment Method ---
  async assignToLearners(videoId: string, learnerIds: string[]) {
    this.validateObjectId(videoId);

    // Convert string IDs to MongoDB ObjectIds
    const objectIds = learnerIds.map(id => new Types.ObjectId(id));
    
    // 1. Update Video Document ($addToSet ensures no duplicate learner IDs)
    const video = await this.videoModel.findByIdAndUpdate(
      videoId, 
      { $addToSet: { assignedTo: { $each: objectIds } } },
      { new: true }
    );

    if (!video) throw new NotFoundException('Video not found');

    // 2. Create Progress Documents for each learner ($setOnInsert ensures we don't overwrite existing progress)
    const progressPromises = objectIds.map(userId => 
      this.progressModel.findOneAndUpdate(
        { userId, videoId: new Types.ObjectId(videoId) },
        { $setOnInsert: { status: 'ASSIGNED', completionPercentage: 0, lastWatchedTimestamp: 0 } },
        { upsert: true, new: true }
      )
    );
    await Promise.all(progressPromises);
    
    return { message: 'Video assigned successfully', assignedCount: video.assignedTo.length };
  }

async saveProgress(videoId: string, userId: string, currentTime: number, duration: number) {
    this.validateObjectId(videoId);
    
    // Calculate percentage based on duration
    const percentage = duration > 0 ? Math.round((currentTime / duration) * 100) : 0;
    const status = percentage >= 95 ? 'COMPLETED' : 'IN_PROGRESS';

    await this.progressModel.findOneAndUpdate(
      { videoId: new Types.ObjectId(videoId), userId: new Types.ObjectId(userId) },
      { $set: { lastWatchedTimestamp: currentTime, completionPercentage: percentage, status } },
      { upsert: true }
    );
    
    return { success: true };
  }

  async checkAnswer(videoId: string, timestamp: number, answer: string | string[], userId: string) {
    this.validateObjectId(videoId);
    const video = await this.videoModel.findById(videoId).exec();
    if (!video) throw new NotFoundException('Video not found');

    const question = video.questions.find(q => q.timestamp === timestamp);
    if (!question) throw new NotFoundException('Question not found');

    // 1. Normalize correct answers and submitted answers for accurate comparison
    const correctAnswers = question.correctAnswers.map(a => a.toLowerCase().trim());
    
    // Ensure submitted answers are an array
    const submittedAnswers = Array.isArray(answer) 
      ? answer.map(a => a.toLowerCase().trim()) 
      : [answer.toLowerCase().trim()];

    // 2. Check if the arrays contain the exact same elements
    const isCorrect = correctAnswers.length === submittedAnswers.length &&
                      correctAnswers.every(ca => submittedAnswers.includes(ca));

    // 3. Convert array to string so it fits securely in the AnswerRecord schema
    const answerString = Array.isArray(answer) ? answer.join(', ') : answer;

    // Record the answer in the Learner's Progress document
    await this.progressModel.findOneAndUpdate(
      { videoId: new Types.ObjectId(videoId), userId: new Types.ObjectId(userId) },
      { 
        $push: { 
          responses: { timestamp, isCorrect, answerGiven: answerString } 
        } 
      },
      { upsert: true }
    );

    return { 
      isCorrect, 
      correctAnswers: question.correctAnswers, 
      message: isCorrect ? 'Correct!' : 'Incorrect.' 
    };
  }


  async remove(videoId: string, adminId: string) {
    this.validateObjectId(videoId);

    // 1. Delete the video document
    const video = await this.videoModel.findOneAndDelete({ 
      _id: videoId, 
      createdBy: new Types.ObjectId(adminId) 
    });

    if (!video) throw new NotFoundException('Video not found or you do not have permission to delete it');

    // 2. CASCADING DELETE: Remove all learner progress associated with this deleted video
    await this.progressModel.deleteMany({ videoId: new Types.ObjectId(videoId) });
    
    return { message: 'Video and associated learner progress deleted successfully' };
  }
  // --- ADMIN METRICS: Get all learner progress for Admin's videos ---
  async getAdminLearnerMetrics(adminId: string, learnerId: string) {
    // 1. Find all videos created by THIS admin that are assigned to THIS learner
    const adminVideos = await this.videoModel.find({ 
      createdBy: new Types.ObjectId(adminId),
      assignedTo: new Types.ObjectId(learnerId)
    }).select('_id title questions').lean();

    const videoIds = adminVideos.map(v => v._id);

    // 2. Fetch the progress for those specific videos
    const progresses = await this.progressModel.find({ 
      userId: new Types.ObjectId(learnerId), 
      videoId: { $in: videoIds } 
    }).lean();

    // 3. Merge data
    return adminVideos.map(video => {
      const prog = progresses.find(p => p.videoId.toString() === video._id.toString());
      const responses = prog?.responses || [];
      return {
        _id: video._id,
        title: video.title,
        status: prog?.status || 'ASSIGNED',
        completionPercentage: prog?.completionPercentage || 0,
        totalQuestions: video.questions.length,
        correctAnswers: responses.filter(r => r.isCorrect).length,
        wrongAnswers: responses.filter(r => !r.isCorrect).length,
      };
    });
  }

  
}