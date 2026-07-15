import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum QuestionType { SINGLE_CHOICE = 'SINGLE_CHOICE', MULTI_CHOICE = 'MULTI_CHOICE', SHORT_ANSWER = 'SHORT_ANSWER' }

@Schema({ _id: true }) 
export class Question {
  @Prop({ required: true }) timestamp: number;
  @Prop({ required: true, enum: QuestionType }) type: QuestionType;
  @Prop({ required: true }) text: string;
  @Prop([String]) options: string[];
  @Prop([String]) correctAnswers: string[];
}
export const QuestionSchema = SchemaFactory.createForClass(Question);

@Schema({ timestamps: true })
export class Video extends Document {
  @Prop()
  thumbnailUrl: string;
  @Prop({ required: true, trim: true }) title: string;
  @Prop({ default: 'Description unavailable.', trim: true }) description: string;
  @Prop({ required: true }) videoUrl: string;
  @Prop({ default: false }) isPublished: boolean;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) createdBy: Types.ObjectId;
  @Prop([{ type: Types.ObjectId, ref: 'User' }]) assignedTo: Types.ObjectId[];
  @Prop({ type: [QuestionSchema], default: [] }) questions: Question[];
}
export const VideoSchema = SchemaFactory.createForClass(Video);