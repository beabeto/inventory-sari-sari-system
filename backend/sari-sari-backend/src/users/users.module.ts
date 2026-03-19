import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // <-- Important!
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // optional, if other modules use it
})
export class UsersModule {}