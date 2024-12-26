import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateFeedbackDto {
  @IsMongoId()
  @IsNotEmpty()
  reviewId: string; // ID of the review being commented on

  @IsString()
  @IsNotEmpty()
  content: string; // Feedback content
}
