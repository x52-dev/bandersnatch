import { Model, Types } from 'mongoose';
import { Video } from './schemas/video.schema';
import { Progress } from '../progress/schemas/progress.schema';
import { CreateVideoDto, UpdateVideoDto } from './dto/create-video.dto';
export declare class VideosService {
    private videoModel;
    private progressModel;
    constructor(videoModel: Model<Video>, progressModel: Model<Progress>);
    private validateObjectId;
    create(createVideoDto: CreateVideoDto, adminId: string): Promise<import("mongoose").Document<unknown, {}, Video, {}, import("mongoose").DefaultSchemaOptions> & Video & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAllAdmin(adminId: string): Promise<(import("mongoose").Document<unknown, {}, Video, {}, import("mongoose").DefaultSchemaOptions> & Video & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    update(videoId: string, updateData: UpdateVideoDto, adminId: string): Promise<import("mongoose").Document<unknown, {}, Video, {}, import("mongoose").DefaultSchemaOptions> & Video & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    togglePublish(videoId: string, isPublished: boolean, adminId: string): Promise<import("mongoose").Document<unknown, {}, Video, {}, import("mongoose").DefaultSchemaOptions> & Video & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findOneAdmin(videoId: string, adminId: string): Promise<import("mongoose").Document<unknown, {}, Video, {}, import("mongoose").DefaultSchemaOptions> & Video & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    getLearnerReports(videoId: string, adminId: string): Promise<(import("mongoose").Document<unknown, {}, Progress, {}, import("mongoose").DefaultSchemaOptions> & Progress & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    assignToLearners(videoId: string, learnerIds: string[]): Promise<{
        message: string;
        assignedCount: number;
    }>;
    saveProgress(videoId: string, userId: string, currentTime: number, duration: number): Promise<{
        success: boolean;
    }>;
    checkAnswer(videoId: string, timestamp: number, answer: string, userId: string): Promise<{
        isCorrect: boolean;
        correctAnswers: string[];
        message: string;
    }>;
    getAdminLearnerMetrics(adminId: string, learnerId: string): Promise<{
        _id: Types.ObjectId;
        title: string;
        status: string;
        completionPercentage: number;
        totalQuestions: number;
        correctAnswers: number;
        wrongAnswers: number;
    }[]>;
}
