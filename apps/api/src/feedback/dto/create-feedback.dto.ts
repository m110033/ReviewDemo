import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { ObjectIdTransformer } from 'src/common/transformers/object-id.transformer';

export class CreateFeedbackDto {
  @IsNotEmpty()
  @ObjectIdTransformer()
  reviewId: Types.ObjectId; // ID of the review being commented on

  @IsString()
  @IsNotEmpty()
  content: string; // Feedback content
}
