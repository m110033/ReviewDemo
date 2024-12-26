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
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EmployeeRoleEnum } from './enums/role.enum';
import { ValidationException } from 'src/common/exceptions/validation.exception';
import { ErrorCode } from 'src/common/enums/error-code.enum';
import { Types } from 'mongoose';

@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeesController {
  constructor(private readonly EmployeesService: EmployeesService) {}

  @Post()
  @Roles(EmployeeRoleEnum.ADMIN)
  async create(@Body() CreateEmployeeDto: CreateEmployeeDto) {
    return await this.EmployeesService.create(CreateEmployeeDto);
  }

  @Get()
  @Roles(EmployeeRoleEnum.ADMIN, EmployeeRoleEnum.EMPLOYEE)
  async find() {
    return await this.EmployeesService.findAll();
  }

  @Get(':id')
  @Roles(EmployeeRoleEnum.ADMIN, EmployeeRoleEnum.EMPLOYEE)
  async findOnee(@Param('id') id: string) {
    const object = await this.EmployeesService.findOne(new Types.ObjectId(id));
    if (!object) {
      throw new ValidationException({
        message: 'Employee not found',
        code: ErrorCode.OBJECT_NOT_FOUND,
      });
    }
    return object;
  }

  @Patch(':id')
  @Roles(EmployeeRoleEnum.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() UpdateEmployeeDto: Partial<CreateEmployeeDto>,
  ) {
    return await this.EmployeesService.update(id, UpdateEmployeeDto);
  }

  @Delete(':id')
  @Roles(EmployeeRoleEnum.ADMIN)
  async delete(@Param('id') id: string) {
    return this.EmployeesService.remove(id);
  }
}
