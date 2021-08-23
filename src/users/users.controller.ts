import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { UserEntity } from 'src/db/user.entity'
import { GetAndReturnBooksDto } from './dto/get-return-books.dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Get()
    async findAll(): Promise<UserEntity[]> {
        return await this.userService.findAll()
    }

    @Get(':id')
    async findUserById(@Param('id') id: number): Promise<UserEntity> {
        return await this.userService.findUserById(id)
    }

    @Post()
    async createUser(@Body() user: UserEntity): Promise<UserEntity> {
        return await this.userService.createUser(user)
    }

    @Put('return')
    async returnBooks(@Body() userIdAndBooksToReturn: GetAndReturnBooksDto) {
        return await this.userService.returnBooks(userIdAndBooksToReturn)
    }

    @Put('borrow')
    async borrowBooks(@Body() userIdAndBooksToBorrow: GetAndReturnBooksDto) {
        return await this.userService.borrowBooks(userIdAndBooksToBorrow)
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: number) {
        return await this.userService.deleteUser(id)
    }
}
