import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Divider } from './entities/divider.entity';
import { DividersService } from './dividers.service';
import { DividersController } from './dividers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Divider])],
  providers: [DividersService],
  controllers: [DividersController],
  exports: [DividersService],
})
export class DividersModule {}
