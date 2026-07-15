"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const videos_controller_1 = require("./videos.controller");
const learner_controller_1 = require("./learner.controller");
const videos_service_1 = require("./videos.service");
const video_schema_1 = require("./schemas/video.schema");
const progress_schema_1 = require("../progress/schemas/progress.schema");
const storage_module_1 = require("../storage/storage.module");
let VideosModule = class VideosModule {
};
exports.VideosModule = VideosModule;
exports.VideosModule = VideosModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: video_schema_1.Video.name, schema: video_schema_1.VideoSchema },
                { name: progress_schema_1.Progress.name, schema: progress_schema_1.ProgressSchema }
            ]),
            storage_module_1.StorageModule,
        ],
        controllers: [
            videos_controller_1.VideosController,
            learner_controller_1.LearnerController
        ],
        providers: [videos_service_1.VideosService],
        exports: [videos_service_1.VideosService]
    })
], VideosModule);
//# sourceMappingURL=videos.module.js.map