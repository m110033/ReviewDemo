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
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { EmployeeRoleEnum } from 'src/employees/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EmployeeObject } from 'src/common/decorators/employee.decorator';
import { Employees } from 'src/employees/schemas/employee.schema';
import { EmployeesService } from 'src/employees/employees.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly employeesService: EmployeesService,
  ) {}

  @Post()
  @Roles(EmployeeRoleEnum.ADMIN) // Only admins can create reviews
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  // Admin fetches all reviews (management view)
  @Get('/admin')
  @Roles(EmployeeRoleEnum.ADMIN)
  findAllForAdmin() {
    return this.reviewsService.findAllForAdmin();
  }

  // Employee fetches reviews requiring feedback
  @Get()
  @Roles(EmployeeRoleEnum.ADMIN, EmployeeRoleEnum.EMPLOYEE)
  async findAllForEmployee(@EmployeeObject() employee: Employees) {
    const object = await this.employeesService.findOneByEmail(employee.email);
    return this.reviewsService.findAllForEmployee(object._id.toString());
  }

  @Get(':id')
  @Roles(EmployeeRoleEnum.ADMIN, EmployeeRoleEnum.EMPLOYEE) // Both roles can fetch a review
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @Roles(EmployeeRoleEnum.ADMIN) // Only admins can update reviews
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Delete(':id')
  @Roles(EmployeeRoleEnum.ADMIN) // Only admins can delete reviews
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
