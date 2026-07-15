import { QuestionType } from '../schemas/video.schema';
export declare class QuestionDto {
    timestamp: number;
    type: QuestionType;
    text: string;
    options?: string[];
    correctAnswers?: string[];
}
export declare class CreateVideoDto {
    title: string;
    description?: string;
    thumbnailUrl?: string;
    videoUrl: string;
    questions?: QuestionDto[];
}
export declare class UpdateVideoDto {
    title?: string;
    description?: string;
    isPublished?: boolean;
    questions?: QuestionDto[];
}
export declare class AssignVideoDto {
    learnerIds: string[];
}
