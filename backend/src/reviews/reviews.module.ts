import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewSchema } from './schemas/review.schema';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { EmployeesModule } from 'src/employees/employees.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Review', schema: ReviewSchema }]),
    EmployeesModule,
  ],
  providers: [ReviewsService],
  exports: [ReviewsService],
  controllers: [ReviewsController],
})
export class ReviewsModule {}
