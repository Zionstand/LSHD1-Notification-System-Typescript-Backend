import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule,
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
