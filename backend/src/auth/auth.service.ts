import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Employees } from 'src/employees/schemas/employee.schema';
import { EmployeesService } from 'src/employees/employees.service';

@Injectable()
export class AuthService {
  constructor(
    private EmployeesService: EmployeesService,
    private jwtService: JwtService,
  ) {}

  async validateEmployee(email: string, password: string): Promise<any> {
    const employee = await this.EmployeesService.validateEmployee(
      email,
      password,
    );
    if (!employee) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return employee;
  }

  async login(employee: Employees) {
    const payload = {
      email: employee.email,
      username: employee.username,
      role: employee.role,
    };
    return { access_token: this.jwtService.sign(payload) };
  }
}
