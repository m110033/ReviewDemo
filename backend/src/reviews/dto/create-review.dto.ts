import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import * as mongoose from 'mongoose';
import { ObjectIdTransformer } from 'src/common/transformers/object-id.transformer';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  title: string; // Review title (e.g., "Q1 Performance Review")

  @IsString()
  @IsNotEmpty()
  description: string; // Description of the review

  @IsNotEmpty()
  @ObjectIdTransformer()
  targetEmployee: mongoose.Types.ObjectId; // The ID of the employee being reviewed

  @IsArray()
  @IsOptional()
  @ObjectIdTransformer()
  participants?: mongoose.Types.ObjectId[]; // Optional: Array of IDs of participants for the review
}
