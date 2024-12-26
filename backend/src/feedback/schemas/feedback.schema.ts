import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, autoIndex: true })
export class Feedback extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Review', required: true })
  reviewId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  participant: Types.ObjectId;

  @Prop({ required: true, trim: true })
  content: string;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);

FeedbackSchema.index({ reviewId: 1, participant: 1 }, { unique: true });
