import { Document, Types } from 'mongoose';
export declare enum QuestionType {
    SINGLE_CHOICE = "SINGLE_CHOICE",
    MULTI_CHOICE = "MULTI_CHOICE",
    SHORT_ANSWER = "SHORT_ANSWER"
}
export declare class Question {
    timestamp: number;
    type: QuestionType;
    text: string;
    options: string[];
    correctAnswers: string[];
}
export declare const QuestionSchema: import("mongoose").Schema<Question, import("mongoose").Model<Question, any, any, any, any, any, Question>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Question, Document<unknown, {}, Question, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Question & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    timestamp?: import("mongoose").SchemaDefinitionProperty<number, Question, Document<unknown, {}, Question, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Question & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<QuestionType, Question, Document<unknown, {}, Question, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Question & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    text?: import("mongoose").SchemaDefinitionProperty<string, Question, Document<unknown, {}, Question, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Question & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    options?: import("mongoose").SchemaDefinitionProperty<string[], Question, Document<unknown, {}, Question, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Question & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    correctAnswers?: import("mongoose").SchemaDefinitionProperty<string[], Question, Document<unknown, {}, Question, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Question & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Question>;
export declare class Video extends Document {
    title: string;
    description: string;
    videoUrl: string;
    isPublished: boolean;
    createdBy: Types.ObjectId;
    assignedTo: Types.ObjectId[];
    questions: Question[];
}
export declare const VideoSchema: import("mongoose").Schema<Video, import("mongoose").Model<Video, any, any, any, any, any, Video>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Video, Document<unknown, {}, Video, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Video & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Video, Document<unknown, {}, Video, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Video & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, Video, Document<unknown, {}, Video, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Video & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    title?: import("mongoose").SchemaDefinitionProperty<string, Video, Document<unknown, {}, Video, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Video & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    videoUrl?: import("mongoose").SchemaDefinitionProperty<string, Video, Document<unknown, {}, Video, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Video & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isPublished?: import("mongoose").SchemaDefinitionProperty<boolean, Video, Document<unknown, {}, Video, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Video & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    createdBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Video, Document<unknown, {}, Video, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Video & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    assignedTo?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId[], Video, Document<unknown, {}, Video, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Video & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    questions?: import("mongoose").SchemaDefinitionProperty<Question[], Video, Document<unknown, {}, Video, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Video & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Video>;
