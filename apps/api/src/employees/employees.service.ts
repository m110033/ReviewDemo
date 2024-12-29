import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employees } from './schemas/employee.schema';
import * as bcrypt from 'bcrypt';
import { EmployeeRoleEnum } from './enums/role.enum';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel('Employees') private readonly employeeModel: Model<Employees>,
  ) {}

  async onApplicationBootstrap() {
    const adminExists = await this.employeeModel.exists({
      email: 'admin@example.com',
    });
    if (!adminExists) {
      const hashedPassword = await this.encryptPassword('admin20241231');
      const employee = new this.employeeModel({
        username: 'admin',
        password: hashedPassword,
        email: 'admin@example.com',
        role: 'admin',
      });
      await employee.save();
    }
  }

  async encryptPassword(password: string) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async create(dto: CreateEmployeeDto): Promise<Employees> {
    if (dto.password && dto.password !== '') {
      dto.password = await this.encryptPassword(dto.password);
    } else {
      delete dto.password;
    }
    const model = new this.employeeModel(dto);
    return model.save();
  }

  async findAll(): Promise<Employees[]> {
    return (await this.employeeModel
      .find()
      .select('email username password role')
      .lean()
      .exec()) as Employees[];
  }

  async findPartial(role: EmployeeRoleEnum): Promise<Employees[]> {
    return (await this.employeeModel
      .find({ role })
      .select('email username password role')
      .lean()
      .exec()) as Employees[];
  }

  async findOne(id: Types.ObjectId): Promise<Employees> {
    const object = await this.employeeModel
      .findById(id)
      .select('email username password role')
      .lean()
      .exec();
    return object as Employees;
  }

  async findOneByEmail(email: string): Promise<Employees> {
    const temp = await this.employeeModel
      .findOne({ email })
      .select('email username password role')
      .lean()
      .exec();
    return temp as Employees;
  }

  async validateEmployee(email: string, password: string): Promise<any> {
    const employee = await this.findOneByEmail(email);
    if (!employee) {
      return null;
    }
    const isValied = await bcrypt.compare(password, employee.password);
    if (!!employee && isValied) {
      const { password, ...result } = employee;
      return result;
    }
    return null;
  }

  async update(id: string, dto: UpdateEmployeeDto): Promise<Employees> {
    if (dto.password && dto.password !== '') {
      dto.password = await this.encryptPassword(dto.password);
    } else {
      delete dto.password;
    }
    return await this.employeeModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Employees> {
    return await this.employeeModel.findByIdAndDelete(id).exec();
  }
}
