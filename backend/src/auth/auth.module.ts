import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { EmployeesModule } from 'src/employees/employees.module';
import { LocalStrategy } from './local.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    EmployeesModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [
    AuthService,
    LocalAuthGuard,
    LocalStrategy,
    JwtAuthGuard,
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
