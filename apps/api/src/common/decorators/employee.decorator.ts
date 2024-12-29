import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { EmployeeRoleEnum } from 'src/employees/enums/role.enum';

type RequestEmployee = {
  id: string;
  email: number;
  username: string;
  role: EmployeeRoleEnum;
};

export const EmployeeObject = createParamDecorator(
  (key: any, ctx: ExecutionContext) => {
    const { user } = ctx.switchToHttp().getRequest();
    const employee = user as RequestEmployee;
    return employee;
  },
);
