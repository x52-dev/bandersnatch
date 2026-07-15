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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressSchema = exports.Progress = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Progress = class Progress extends mongoose_2.Document {
    userId;
    videoId;
    lastWatchedTimestamp;
    completionPercentage;
    status;
    responses;
};
exports.Progress = Progress;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Progress.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Video', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Progress.prototype, "videoId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Progress.prototype, "lastWatchedTimestamp", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Progress.prototype, "completionPercentage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['ASSIGNED', 'IN_PROGRESS', 'COMPLETED'], default: 'ASSIGNED' }),
    __metadata("design:type", String)
], Progress.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)([{
            questionId: { type: mongoose_2.Types.ObjectId },
            answerProvided: [String],
            isCorrect: Boolean
        }]),
    __metadata("design:type", Array)
], Progress.prototype, "responses", void 0);
exports.Progress = Progress = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Progress);
exports.ProgressSchema = mongoose_1.SchemaFactory.createForClass(Progress);
//# sourceMappingURL=progress.schema.js.map