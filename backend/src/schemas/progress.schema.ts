import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
export class AnswerRecord {
  @Prop() timestamp: number;
  @Prop() isCorrect: boolean;
  @Prop() answerGiven: string;
}
export const AnswerRecordSchema = SchemaFactory.createForClass(AnswerRecord);

@Schema({ timestamps: true })
export class Progress extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) userId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Video', required: true }) videoId: Types.ObjectId;
  @Prop({ default: 'ASSIGNED' }) status: string; // ASSIGNED, IN_PROGRESS, COMPLETED
  @Prop({ default: 0 }) completionPercentage: number;
  @Prop({ default: 0 }) lastWatchedTimestamp: number;
  @Prop({ type: [AnswerRecordSchema], default: [] }) responses: AnswerRecord[];
}
export const ProgressSchema = SchemaFactory.createForClass(Progress);