import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { EmployeeRoleEnum } from 'src/employees/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ReviewsService } from 'src/reviews/reviews.service';
import { ValidationException } from 'src/common/exceptions/validation.exception';
import { ErrorCode } from 'src/common/enums/error-code.enum';
import { EmployeesService } from 'src/employees/employees.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Employees } from 'src/employees/schemas/employee.schema';
import { EmployeeObject } from 'src/common/decorators/employee.decorator';
import { Types } from 'mongoose';

@Controller('feedbacks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FeedbackController {
  constructor(
    private readonly employeesService: EmployeesService,
    private readonly feedbackService: FeedbackService,
    private readonly reviewService: ReviewsService,
  ) {}

  @Post()
  @Roles(EmployeeRoleEnum.ADMIN, EmployeeRoleEnum.EMPLOYEE)
  async create(
    @EmployeeObject() employee: Employees,
    @Body() dto: CreateFeedbackDto,
  ) {
    const review = await this.reviewService.findOne(dto.reviewId);
    if (!review) {
      throw new ValidationException({
        message: `Review with ID ${dto.reviewId} not found`,
        code: ErrorCode.OBJECT_NOT_FOUND,
      });
    }

    const object = await this.employeesService.findOneByEmail(employee.email);

    const feedback = await this.feedbackService.create(dto, object.id);

    return feedback;
  }

  @Get()
  @Roles(EmployeeRoleEnum.ADMIN, EmployeeRoleEnum.EMPLOYEE)
  async findAll(@EmployeeObject() employee: Employees) {
    const object = await this.employeesService.findOneByEmail(employee.email);
    const feedbacks = await this.feedbackService.findAll(
      object._id as Types.ObjectId,
    );
    return feedbacks;
  }

  @Patch(':id')
  @Roles(EmployeeRoleEnum.ADMIN, EmployeeRoleEnum.EMPLOYEE)
  async update(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ) {
    const updatedFeedback = await this.feedbackService.update(
      id,
      updateFeedbackDto,
    );
    return updatedFeedback;
  }

  @Delete(':id')
  @Roles(EmployeeRoleEnum.ADMIN)
  async remove(@Param('id') id: string) {
    return await this.feedbackService.remove(id);
  }
}
