import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BookEntity } from 'src/db/book.entity'
import { Repository } from 'typeorm'

@Injectable()
export class BooksService {
    constructor(
        @InjectRepository(BookEntity)
        private bookRepository: Repository<BookEntity>,
    ) {}

    async findAll(): Promise<BookEntity[]> {
        return await this.bookRepository.find({
            relations: ['user'],
        })
    }

    async findOne(id: number): Promise<BookEntity> {
        let book = await this.bookRepository.find({
            where: {
                id: id,
            },
            relations: ['user'],
        })

        console.log('book = ')
        console.log(book)
        return book[0]
    }

    async createBook(book: BookEntity): Promise<BookEntity> {
        let newBook = this.bookRepository.create()
        newBook.name = book.name
        newBook.user = null
        this.bookRepository.save(newBook)
        return newBook
    }

    async deleteBook(id: number) {
        this.bookRepository.delete(id)
    }
}
