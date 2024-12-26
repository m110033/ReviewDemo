import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Review extends Document {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  targetEmployee: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Employee' }] })
  participants: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Feedback' })
  feedbacks: Types.ObjectId[];
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
