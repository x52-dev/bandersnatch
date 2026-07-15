import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Progress extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) userId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Video', required: true }) videoId: Types.ObjectId;
  @Prop({ default: 0 }) lastWatchedTimestamp: number;
  @Prop({ default: 0 }) completionPercentage: number;
  @Prop({ enum: ['ASSIGNED', 'IN_PROGRESS', 'COMPLETED'], default: 'ASSIGNED' }) status: string;
  
  @Prop([{
    questionId: { type: Types.ObjectId },
    answerProvided: [String],
    isCorrect: Boolean
  }]) responses: Record<string, any>[];
}
export const ProgressSchema = SchemaFactory.createForClass(Progress);