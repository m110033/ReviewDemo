import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Feedback } from './schemas/feedback.schema';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { ReviewsService } from 'src/reviews/reviews.service';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name) private readonly feedbackModel: Model<Feedback>,
    private readonly reviewsService: ReviewsService,
  ) {}

  async create(
    dto: CreateFeedbackDto,
    participant: Types.ObjectId,
  ): Promise<Feedback> {
    const temp = await this.findAllByReviewId(dto.reviewId);
    const feedbacks = temp.map((i) => i._id as Types.ObjectId);
    const model = new this.feedbackModel({
      reviewId: dto.reviewId,
      content: dto.content,
      participant,
    });
    const feedback = await model.save();
    feedbacks.push(feedback._id as Types.ObjectId);
    await this.reviewsService.updateFeedbacks(dto.reviewId, feedbacks);
    return feedback;
  }

  async findAll(participant: Types.ObjectId): Promise<Feedback[]> {
    const items = await this.feedbackModel
      .find({ participant })
      .select('reviewId participant content')
      .lean()
      .exec();
    return items as Feedback[];
  }

  async findAllByReviewId(id: Types.ObjectId): Promise<Feedback[]> {
    const items = await this.feedbackModel
      .find({ reviewId: id })
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
