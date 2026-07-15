"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const video_schema_1 = require("./schemas/video.schema");
const progress_schema_1 = require("../progress/schemas/progress.schema");
let VideosService = class VideosService {
    videoModel;
    progressModel;
    constructor(videoModel, progressModel) {
        this.videoModel = videoModel;
        this.progressModel = progressModel;
    }
    validateObjectId(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException(`Invalid identifier format: ${id}`);
        }
    }
    async create(createVideoDto, adminId) {
        const processedDto = {
            ...createVideoDto,
            description: createVideoDto.description?.trim() ? createVideoDto.description : undefined,
        };
        const video = new this.videoModel({
            ...processedDto,
            createdBy: new mongoose_2.Types.ObjectId(adminId),
        });
        return video.save();
    }
    async findAllAdmin(adminId) {
        return this.videoModel
            .find({ createdBy: new mongoose_2.Types.ObjectId(adminId) })
            .sort({ createdAt: -1 })
            .exec();
    }
    async update(videoId, updateData, adminId) {
        this.validateObjectId(videoId);
        const video = await this.videoModel.findOneAndUpdate({ _id: videoId, createdBy: new mongoose_2.Types.ObjectId(adminId) }, { $set: updateData }, { new: true, runValidators: true });
        if (!video)
            throw new common_1.NotFoundException('Video not found or you do not have permission to edit it');
        return video;
    }
    async togglePublish(videoId, isPublished, adminId) {
        this.validateObjectId(videoId);
        const video = await this.videoModel.findOneAndUpdate({ _id: videoId, createdBy: new mongoose_2.Types.ObjectId(adminId) }, { $set: { isPublished } }, { new: true });
        if (!video)
            throw new common_1.NotFoundException('Video not found');
        return video;
    }
    async findOneAdmin(videoId, adminId) {
        this.validateObjectId(videoId);
        const video = await this.videoModel.findOne({ _id: videoId, createdBy: new mongoose_2.Types.ObjectId(adminId) }).exec();
        if (!video)
            throw new common_1.NotFoundException('Video not found or unauthorized');
        return video;
    }
    async getLearnerReports(videoId, adminId) {
        this.validateObjectId(videoId);
        const video = await this.videoModel.findOne({ _id: videoId, createdBy: new mongoose_2.Types.ObjectId(adminId) });
        if (!video)
            throw new common_1.NotFoundException('Video not found');
        return this.progressModel.find({ videoId: new mongoose_2.Types.ObjectId(videoId) })
            .populate('userId', 'name email')
            .sort({ updatedAt: -1 })
            .exec();
    }
    async assignToLearners(videoId, learnerIds) {
        this.validateObjectId(videoId);
        const objectIds = learnerIds.map(id => new mongoose_2.Types.ObjectId(id));
        const video = await this.videoModel.findByIdAndUpdate(videoId, { $addToSet: { assignedTo: { $each: objectIds } } }, { new: true });
        if (!video)
            throw new common_1.NotFoundException('Video not found');
        const progressPromises = objectIds.map(userId => this.progressModel.findOneAndUpdate({ userId, videoId: new mongoose_2.Types.ObjectId(videoId) }, { $setOnInsert: { status: 'ASSIGNED', completionPercentage: 0, lastWatchedTimestamp: 0 } }, { upsert: true, new: true }));
        await Promise.all(progressPromises);
        return { message: 'Video assigned successfully', assignedCount: video.assignedTo.length };
    }
    async saveProgress(videoId, userId, currentTime, duration) {
        this.validateObjectId(videoId);
        const percentage = duration > 0 ? Math.round((currentTime / duration) * 100) : 0;
        const status = percentage >= 95 ? 'COMPLETED' : 'IN_PROGRESS';
        await this.progressModel.findOneAndUpdate({ videoId: new mongoose_2.Types.ObjectId(videoId), userId: new mongoose_2.Types.ObjectId(userId) }, { $set: { lastWatchedTimestamp: currentTime, completionPercentage: percentage, status } }, { upsert: true });
        return { success: true };
    }
    async checkAnswer(videoId, timestamp, answer, userId) {
        this.validateObjectId(videoId);
        const video = await this.videoModel.findById(videoId).exec();
        if (!video)
            throw new common_1.NotFoundException('Video not found');
        const question = video.questions.find(q => q.timestamp === timestamp);
        if (!question)
            throw new common_1.NotFoundException('Question not found');
        const isCorrect = question.correctAnswers.some(ca => ca.toLowerCase() === answer.toLowerCase());
        await this.progressModel.findOneAndUpdate({ videoId: new mongoose_2.Types.ObjectId(videoId), userId: new mongoose_2.Types.ObjectId(userId) }, {
            $push: {
                responses: { timestamp, isCorrect, answerGiven: answer }
            }
        }, { upsert: true });
        return { isCorrect, correctAnswers: question.correctAnswers, message: isCorrect ? 'Correct!' : 'Incorrect.' };
    }
    async getAdminLearnerMetrics(adminId, learnerId) {
        const adminVideos = await this.videoModel.find({
            createdBy: new mongoose_2.Types.ObjectId(adminId),
            assignedTo: new mongoose_2.Types.ObjectId(learnerId)
        }).select('_id title questions').lean();
        const videoIds = adminVideos.map(v => v._id);
        const progresses = await this.progressModel.find({
            userId: new mongoose_2.Types.ObjectId(learnerId),
            videoId: { $in: videoIds }
        }).lean();
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
};
exports.VideosService = VideosService;
exports.VideosService = VideosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(video_schema_1.Video.name)),
    __param(1, (0, mongoose_1.InjectModel)(progress_schema_1.Progress.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], VideosService);
//# sourceMappingURL=videos.service.js.map