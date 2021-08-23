import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from 'src/db/book.entity';
import { UserEntity } from 'src/db/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), TypeOrmModule.forFeature([BookEntity])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
