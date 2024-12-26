import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel('Review') private readonly reviewModel: Model<Review>,
  ) {}

  create(createReviewDto: CreateReviewDto): Promise<Review> {
    const createdReview = new this.reviewModel(createReviewDto);
    return createdReview.save();
  }

  findAll(): Promise<Review[]> {
    return this.reviewModel.find().exec();
  }

  findOne(id: string): Promise<Review> {
    return this.reviewModel.findById(id).exec();
  }

  update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    return this.reviewModel
      .findByIdAndUpdate(id, updateReviewDto, { new: true })
      .exec();
  }

  remove(id: string): Promise<Review> {
    return this.reviewModel.findByIdAndDelete(id).exec();
  }
}
