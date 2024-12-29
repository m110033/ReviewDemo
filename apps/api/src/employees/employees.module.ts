import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { EmployeeSchema } from './schemas/employee.schema';
import { ReviewsModule } from 'src/reviews/reviews.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Employees', schema: EmployeeSchema }]),
    forwardRef(() => ReviewsModule),
  ],
  providers: [EmployeesService],
  controllers: [EmployeesController],
  exports: [EmployeesService],
})
export class EmployeesModule {}
