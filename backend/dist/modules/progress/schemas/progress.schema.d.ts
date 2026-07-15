import { Document, Types } from 'mongoose';
export declare class Progress extends Document {
    userId: Types.ObjectId;
    videoId: Types.ObjectId;
    lastWatchedTimestamp: number;
    completionPercentage: number;
    status: string;
    responses: Record<string, any>[];
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
    responses?: import("mongoose").SchemaDefinitionProperty<Record<string, any>[], Progress, Document<unknown, {}, Progress, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Progress & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Progress>;
