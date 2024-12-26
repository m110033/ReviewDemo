import { IsString, IsEnum } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  employeeId: string;

  @IsString()
  reviewerId: string;

  @IsString()
  feedback: string;

  @IsEnum(['pending', 'completed'])
  status: string;
}
