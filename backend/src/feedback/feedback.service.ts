import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feedback } from './schemas/feedback.schema';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name) private readonly feedbackModel: Model<Feedback>,
  ) {}

  async create(
    createFeedbackDto: CreateFeedbackDto,
    participant: string,
  ): Promise<Feedback> {
    const feedback = new this.feedbackModel({
      ...createFeedbackDto,
      participant,
    });
    return feedback.save();
  }

  async findAll(participant: string): Promise<Feedback[]> {
    const items = await this.feedbackModel
      .find({ participant })
      .select('reviewId participant content')
      .lean()
      .exec();
    return items as Feedback[];
  }

  async findOne(id: string): Promise<Feedback> {
    const feedback = await this.feedbackModel
      .findById(id)
      .populate('reviewId participant')
      .exec();
    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }
    return feedback;
  }

  async findOneByReviewId(reviewId: string): Promise<Feedback> {
    const feedback = await this.feedbackModel
      .findOne({ reviewId })
      .populate('reviewId participant')
      .exec();
    return feedback;
  }

  async update(
    id: string,
    updateFeedbackDto: UpdateFeedbackDto,
  ): Promise<Feedback> {
    const updatedFeedback = await this.feedbackModel
      .findByIdAndUpdate(id, updateFeedbackDto, { new: true })
      .exec();
    return updatedFeedback;
  }

  async remove(id: string): Promise<Feedback> {
    const deleted = await this.feedbackModel.findByIdAndDelete(id).exec();
    return deleted;
  }
}
