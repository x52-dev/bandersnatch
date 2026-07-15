import { IsString, IsOptional, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionDto } from './create-video.dto';

export class UpdateVideoDto {
  @IsString() @IsOptional() title?: string;
  @IsString() @IsOptional() description?: string;
  @IsBoolean() @IsOptional() isPublished?: boolean;
  @IsArray() @ValidateNested({ each: true }) @Type(() => QuestionDto) @IsOptional() questions?: QuestionDto[];
}