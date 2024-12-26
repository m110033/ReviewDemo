import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EmployeeRoleEnum } from '../enums/role.enum';

@Schema({ timestamps: true })
export class Employees extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    required: true,
    enum: EmployeeRoleEnum,
    default: EmployeeRoleEnum.EMPLOYEE,
  })
  role: EmployeeRoleEnum;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employees);
