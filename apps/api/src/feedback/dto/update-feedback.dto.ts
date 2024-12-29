import { IsOptional, IsString } from 'class-validator';

export class UpdateFeedbackDto {
  @IsString()
  @IsOptional()
  content?: string; // Optional updated feedback content
}
