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
exports.LearnerController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const video_schema_1 = require("./schemas/video.schema");
const progress_schema_1 = require("../progress/schemas/progress.schema");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_schema_1 = require("../users/schemas/user.schema");
const videos_service_1 = require("./videos.service");
let LearnerController = class LearnerController {
    videoModel;
    progressModel;
    videosService;
    constructor(videoModel, progressModel, videosService) {
        this.videoModel = videoModel;
        this.progressModel = progressModel;
        this.videosService = videosService;
    }
    async getAssignedVideos(req) {
        const userId = new mongoose_2.Types.ObjectId(req.user.sub);
        const videos = await this.videoModel.find({
            isPublished: true,
            assignedTo: userId
        })
            .select('-questions.correctAnswers')
            .sort({ createdAt: -1 })
            .lean();
        const progresses = await this.progressModel.find({ userId }).lean();
        return videos.map(v => ({
            ...v,
            progress: progresses.find(p => p.videoId.toString() === v._id.toString()) || null
        }));
    }
    async getVideoDetails(id, req) {
        const userId = new mongoose_2.Types.ObjectId(req.user.sub);
        const videoId = new mongoose_2.Types.ObjectId(id);
        const video = await this.videoModel.findOne({
            _id: videoId,
            isPublished: true,
            assignedTo: userId
        })
            .select('-questions.correctAnswers')
            .lean();
        if (!video)
            throw new common_1.NotFoundException('Video not found or not assigned to you');
        const progress = await this.progressModel.findOne({ videoId, userId }).lean();
        return { video, progress };
    }
    async updateProgress(id, body, req) {
        return this.videosService.saveProgress(id, req.user.sub, body.currentTime, body.duration);
    }
    async checkAnswer(id, timestamp, answer, req) {
        return this.videosService.checkAnswer(id, timestamp, answer, req.user.sub);
    }
};
exports.LearnerController = LearnerController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LearnerController.prototype, "getAssignedVideos", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LearnerController.prototype, "getVideoDetails", null);
__decorate([
    (0, common_1.Put)(':id/progress'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], LearnerController.prototype, "updateProgress", null);
__decorate([
    (0, common_1.Post)(':id/check'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('timestamp')),
    __param(2, (0, common_1.Body)('answer')),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, Object]),
    __metadata("design:returntype", Promise)
], LearnerController.prototype, "checkAnswer", null);
exports.LearnerController = LearnerController = __decorate([
    (0, common_1.Controller)('learner/videos'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.LEARNER),
    __param(0, (0, mongoose_1.InjectModel)(video_schema_1.Video.name)),
    __param(1, (0, mongoose_1.InjectModel)(progress_schema_1.Progress.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        videos_service_1.VideosService])
], LearnerController);
//# sourceMappingURL=learner.controller.js.map