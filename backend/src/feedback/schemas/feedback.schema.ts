import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Employees } from 'src/employees/schemas/employee.schema';
import { Review } from 'src/reviews/schemas/review.schema';

@Schema({ timestamps: true, autoIndex: true })
export class Feedback extends mongoose.Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Review', required: true })
  reviewId: Review;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Employees', required: true })
  participant: Employees;

  @Prop({ required: true, trim: true })
  content: string;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);

FeedbackSchema.index({ reviewId: 1, participant: 1 }, { unique: true });
