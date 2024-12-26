import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Review extends Document {
  @Prop({ required: true })
  employeeId: string;

  @Prop({ required: true })
  reviewerId: string;

  @Prop({ default: '' })
  feedback: string;

  @Prop({ required: true, enum: ['pending', 'completed'], default: 'pending' })
  status: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
