import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Employees } from 'src/employees/schemas/employee.schema';

@Schema({ timestamps: true })
export class Review extends Document {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Employees', required: true })
  targetEmployee: Employees;

  @Prop({ type: Types.ObjectId, ref: 'Employees' })
  participants: Employees[];

  @Prop({ type: Types.ObjectId, ref: 'Feedback' })
  feedbacks: Types.ObjectId[];
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
