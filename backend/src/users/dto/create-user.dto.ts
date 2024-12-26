import { IsString, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsEnum(['admin', 'employee'])
  role: string;
}
