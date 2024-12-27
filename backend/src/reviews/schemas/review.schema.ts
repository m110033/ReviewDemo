import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Employees } from 'src/employees/schemas/employee.schema';
import { Feedback } from 'src/feedback/schemas/feedback.schema';

@Schema({ timestamps: true })
export class Review extends mongoose.Document {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Employees', required: true })
  targetEmployee: Employees;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employees' }] })
  participants: Employees[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' }] })
  feedbacks: Feedback[];
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
