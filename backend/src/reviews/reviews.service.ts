import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { EmployeesService } from 'src/employees/employees.service';
import { ValidationException } from 'src/common/exceptions/validation.exception';
import { ErrorCode } from 'src/common/enums/error-code.enum';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel('Review') private readonly reviewModel: Model<Review>,
    private readonly employeesService: EmployeesService,
  ) {}

  async validateDto(dto: CreateReviewDto | UpdateReviewDto) {
    let object = await this.employeesService.findOne(dto.targetEmployee);
    if (!object) {
      throw new ValidationException({
        message: `${dto.targetEmployee} not found`,
        code: ErrorCode.OBJECT_NOT_FOUND,
      });
    }
    if (dto.participants.includes(dto.targetEmployee)) {
      throw new ValidationException({
        message: `You cannot review yourself`,
        code: ErrorCode.VALIDATION_EXCEPTION,
      });
    }
    // remove duplicate participants
    dto.participants = [...new Set(dto.participants)];
    for (const employee of dto.participants) {
      object = await this.employeesService.findOne(employee);
      if (!object) {
        throw new ValidationException({
          message: `${employee} not found`,
          code: ErrorCode.OBJECT_NOT_FOUND,
        });
      }
    }
  }

  async create(dto: CreateReviewDto): Promise<Review> {
    await this.validateDto(dto);
    const createdReview = new this.reviewModel(dto);
    return createdReview.save();
  }

  async findAllForAdmin(): Promise<Review[]> {
    const items = await this.reviewModel
      .find()
      .select('title description targetEmployee participants');
    return items as Review[];
  }

  async findAllForEmployee(id: Types.ObjectId): Promise<Review[]> {
    const items = await this.reviewModel
      .find({ participants: { $in: [id] } })
      .populate([
        {
          path: 'participants',
          select: 'username',
        },
        {
          path: 'targetEmployee',
          select: 'username',
        },
        {
          path: 'feedbacks',
          select: 'reviewId participant content',
        },
      ])
      .select('title description targetEmployee participants feedbacks');
    return items as Review[];
  }

  async findOne(id: string): Promise<Review> {
    const item = await this.reviewModel
      .findById(id)
      .select('title description targetEmployee participants');
    return item as Review;
  }

  async update(id: string, dto: UpdateReviewDto): Promise<Review> {
    await this.validateDto(dto);
    return this.reviewModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  remove(id: string): Promise<Review> {
    return this.reviewModel.findByIdAndDelete(id).exec();
  }
}
