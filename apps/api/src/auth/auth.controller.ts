import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { EmployeeRoleEnum } from 'src/employees/enums/role.enum';
import { Employees } from 'src/employees/schemas/employee.schema';
import { EmployeeObject } from 'src/common/decorators/employee.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @Get('info')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(EmployeeRoleEnum.ADMIN, EmployeeRoleEnum.EMPLOYEE)
  async find(@EmployeeObject() employee: Employees) {
    return await this.authService.getInfo(employee.email);
  }
}
