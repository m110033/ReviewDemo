import { IsString, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { EmployeeRoleEnum } from '../enums/role.enum';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(EmployeeRoleEnum)
  @IsNotEmpty()
  role: EmployeeRoleEnum;
}
