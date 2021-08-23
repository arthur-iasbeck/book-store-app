import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { BookEntity } from 'src/db/book.entity'
import { BooksService } from './books.service'

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) {}

    @Get()
    async findAll(): Promise<BookEntity[]> {
        return await this.booksService.findAll()
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<BookEntity> {
        return await this.booksService.findOne(id)
    }
    
    @Post()
    async createBook(@Body() book: BookEntity): Promise<BookEntity> {
        return await this.booksService.createBook(book)
    }

    @Delete(':id')
    async deleteBook(@Param('id') id: number) {
        return await this.booksService.deleteBook(id)
    }
}
