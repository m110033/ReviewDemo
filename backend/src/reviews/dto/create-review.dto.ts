import {
  IsString,
  IsNotEmpty,
  IsMongoId,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  title: string; // Review title (e.g., "Q1 Performance Review")

  @IsString()
  @IsNotEmpty()
  description: string; // Description of the review

  @IsMongoId()
  @IsNotEmpty()
  targetEmployee: Types.ObjectId; // The ID of the employee being reviewed

  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  participants?: Types.ObjectId[]; // Optional: Array of IDs of participants for the review
}
