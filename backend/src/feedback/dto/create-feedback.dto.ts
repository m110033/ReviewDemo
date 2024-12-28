import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ObjectIdTransformer } from 'src/common/transformers/object-id.transformer';

export class CreateFeedbackDto {
  @IsMongoId()
  @IsNotEmpty()
  @ObjectIdTransformer()
  reviewId: string; // ID of the review being commented on

  @IsString()
  @IsNotEmpty()
  content: string; // Feedback content
}
