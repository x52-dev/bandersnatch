import { Model, Types } from 'mongoose';
import { Video } from './schemas/video.schema';
import { Progress } from '../progress/schemas/progress.schema';
import { VideosService } from './videos.service';
export declare class LearnerController {
    private videoModel;
    private progressModel;
    private videosService;
    constructor(videoModel: Model<Video>, progressModel: Model<Progress>, videosService: VideosService);
    getAssignedVideos(req: any): Promise<{
        progress: (Progress & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        }) | null;
        title: string;
        description: string;
        videoUrl: string;
        isPublished: boolean;
        createdBy: Types.ObjectId;
        assignedTo: Types.ObjectId[];
        questions: import("./schemas/video.schema").Question[];
        _id: Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }[]>;
    getVideoDetails(id: string, req: any): Promise<{
        video: Video & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
        progress: (Progress & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        }) | null;
    }>;
    updateProgress(id: string, body: {
        currentTime: number;
        duration: number;
    }, req: any): Promise<{
        success: boolean;
    }>;
    checkAnswer(id: string, timestamp: number, answer: string, req: any): Promise<{
        isCorrect: boolean;
        correctAnswers: string[];
        message: string;
    }>;
}
