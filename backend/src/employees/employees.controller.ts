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
import { EmployeeObject } from 'src/common/decorators/employee.decorator';
import { Employees } from './schemas/employee.schema';

@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @Roles(EmployeeRoleEnum.ADMIN)
  async create(@Body() CreateEmployeeDto: CreateEmployeeDto) {
    return await this.employeesService.create(CreateEmployeeDto);
  }

  @Get()
  @Roles(EmployeeRoleEnum.ADMIN, EmployeeRoleEnum.EMPLOYEE)
  async find(@EmployeeObject() employee: Employees) {
    if (employee.role === EmployeeRoleEnum.ADMIN) {
      return await this.employeesService.findAll();
    } else {
      const object = await this.employeesService.findOneByEmail(employee.email);
      return [object];
    }
  }

  @Get(':id')
  @Roles(EmployeeRoleEnum.ADMIN, EmployeeRoleEnum.EMPLOYEE)
  async findOnee(@Param('id') id: string) {
    const object = await this.employeesService.findOne(new Types.ObjectId(id));
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
    return await this.employeesService.update(id, UpdateEmployeeDto);
  }

  @Delete(':id')
  @Roles(EmployeeRoleEnum.ADMIN)
  async delete(@Param('id') id: string) {
    return this.employeesService.remove(id);
  }
}
