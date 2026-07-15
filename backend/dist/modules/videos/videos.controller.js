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
exports.VideosController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const videos_service_1 = require("./videos.service");
const storage_service_1 = require("../storage/storage.service");
const update_video_dto_1 = require("./dto/update-video.dto");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_schema_1 = require("../users/schemas/user.schema");
let VideosController = class VideosController {
    videosService;
    storageService;
    constructor(videosService, storageService) {
        this.videosService = videosService;
        this.storageService = storageService;
    }
    async uploadLocal(file, title, description, req) {
        const videoUrl = await this.storageService.uploadFile(file);
        return this.videosService.create({ title, description, videoUrl, questions: [] }, req.user.sub);
    }
    async uploadUrl(url, title, description, req) {
        const videoUrl = await this.storageService.downloadAndStoreUrl(url);
        return this.videosService.create({ title, description, videoUrl, questions: [] }, req.user.sub);
    }
    findAll(req) {
        return this.videosService.findAllAdmin(req.user.sub);
    }
    findOne(id, req) {
        return this.videosService.findOneAdmin(id, req.user.sub);
    }
    update(id, updateVideoDto, req) {
        return this.videosService.update(id, updateVideoDto, req.user.sub);
    }
    togglePublish(id, isPublished, req) {
        return this.videosService.togglePublish(id, isPublished, req.user.sub);
    }
    assign(id, learnerIds) {
        return this.videosService.assignToLearners(id, learnerIds);
    }
    getLearnerMetrics(learnerId, req) {
        return this.videosService.getAdminLearnerMetrics(req.user.sub, learnerId);
    }
};
exports.VideosController = VideosController;
__decorate([
    (0, common_1.Post)('upload/local'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('title')),
    __param(2, (0, common_1.Body)('description')),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "uploadLocal", null);
__decorate([
    (0, common_1.Post)('upload/url'),
    __param(0, (0, common_1.Body)('url')),
    __param(1, (0, common_1.Body)('title')),
    __param(2, (0, common_1.Body)('description')),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "uploadUrl", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VideosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], VideosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_video_dto_1.UpdateVideoDto, Object]),
    __metadata("design:returntype", void 0)
], VideosController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/publish'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('isPublished')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, Object]),
    __metadata("design:returntype", void 0)
], VideosController.prototype, "togglePublish", null);
__decorate([
    (0, common_1.Post)(':id/assign'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('learnerIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", void 0)
], VideosController.prototype, "assign", null);
__decorate([
    (0, common_1.Get)('metrics/:learnerId'),
    __param(0, (0, common_1.Param)('learnerId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], VideosController.prototype, "getLearnerMetrics", null);
exports.VideosController = VideosController = __decorate([
    (0, common_1.Controller)('admin/videos'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    __metadata("design:paramtypes", [videos_service_1.VideosService,
        storage_service_1.StorageService])
], VideosController);
//# sourceMappingURL=videos.controller.js.map