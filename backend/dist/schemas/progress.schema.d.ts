import { Document, Types } from 'mongoose';
export declare class AnswerRecord {
    timestamp: number;
    isCorrect: boolean;
    answerGiven: string;
}
export declare const AnswerRecordSchema: import("mongoose").Schema<AnswerRecord, import("mongoose").Model<AnswerRecord, any, any, any, any, any, AnswerRecord>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AnswerRecord, Document<unknown, {}, AnswerRecord, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<AnswerRecord & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    timestamp?: import("mongoose").SchemaDefinitionProperty<number, AnswerRecord, Document<unknown, {}, AnswerRecord, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AnswerRecord & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    isCorrect?: import("mongoose").SchemaDefinitionProperty<boolean, AnswerRecord, Document<unknown, {}, AnswerRecord, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AnswerRecord & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    answerGiven?: import("mongoose").SchemaDefinitionProperty<string, AnswerRecord, Document<unknown, {}, AnswerRecord, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<AnswerRecord & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, AnswerRecord>;
export declare class Progress extends Document {
    userId: Types.ObjectId;
    videoId: Types.ObjectId;
    status: string;
    completionPercentage: number;
    lastWatchedTimestamp: number;
    responses: AnswerRecord[];
}
export declare const ProgressSchema: import("mongoose").Schema<Progress, import("mongoose").Model<Progress, any, any, any, any, any, Progress>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Progress, Document<unknown, {}, Progress, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Progress & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    _id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Progress, Document<unknown, {}, Progress, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Progress & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    userId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Progress, Document<unknown, {}, Progress, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Progress & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    videoId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Progress, Document<unknown, {}, Progress, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Progress & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    lastWatchedTimestamp?: import("mongoose").SchemaDefinitionProperty<number, Progress, Document<unknown, {}, Progress, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Progress & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    completionPercentage?: import("mongoose").SchemaDefinitionProperty<number, Progress, Document<unknown, {}, Progress, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Progress & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Progress, Document<unknown, {}, Progress, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Progress & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    responses?: import("mongoose").SchemaDefinitionProperty<AnswerRecord[], Progress, Document<unknown, {}, Progress, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Progress & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Progress>;
