import { 
  IsString, IsOptional, IsUrl, IsArray, ValidateNested, 
  IsEnum, IsNumber, IsMongoId, IsNotEmpty, Min, IsBoolean 
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType } from '../schemas/video.schema';

export class QuestionDto {
  @IsNumber()
  @Min(0)
  timestamp: number;

  @IsEnum(QuestionType)
  type: QuestionType;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  options?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  correctAnswers?: string[];
}

export class CreateVideoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  thumbnailUrl?: string;

  @IsUrl()
  @IsNotEmpty()
  videoUrl: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  @IsOptional()
  questions?: QuestionDto[];
}

export class UpdateVideoDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  @IsOptional()
  questions?: QuestionDto[];
}

export class AssignVideoDto {
  @IsArray()
  @IsMongoId({ each: true })
  learnerIds: string[];
}