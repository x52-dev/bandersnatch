import { VideosService } from './videos.service';
import { StorageService } from '../storage/storage.service';
import { UpdateVideoDto } from './dto/update-video.dto';
export declare class VideosController {
    private readonly videosService;
    private readonly storageService;
    constructor(videosService: VideosService, storageService: StorageService);
    uploadLocal(file: Express.Multer.File, title: string, description: string, req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/video.schema").Video, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/video.schema").Video & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    uploadUrl(url: string, title: string, description: string, req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/video.schema").Video, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/video.schema").Video & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/video.schema").Video, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/video.schema").Video & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(id: string, req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/video.schema").Video, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/video.schema").Video & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, updateVideoDto: UpdateVideoDto, req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/video.schema").Video, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/video.schema").Video & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    togglePublish(id: string, isPublished: boolean, req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/video.schema").Video, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/video.schema").Video & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    assign(id: string, learnerIds: string[]): Promise<{
        message: string;
        assignedCount: number;
    }>;
    getLearnerMetrics(learnerId: string, req: any): Promise<{
        _id: import("mongoose").Types.ObjectId;
        title: string;
        status: string;
        completionPercentage: number;
        totalQuestions: number;
        correctAnswers: number;
        wrongAnswers: number;
    }[]>;
}
