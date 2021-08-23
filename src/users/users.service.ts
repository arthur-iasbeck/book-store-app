import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BookEntity } from 'src/db/book.entity'
import { UserEntity } from 'src/db/user.entity'
import { Repository } from 'typeorm'
import { GetAndReturnBooksDto } from './dto/get-return-books.dto'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
        @InjectRepository(BookEntity)
        private bookRepository: Repository<BookEntity>,
    ) {}

    async findAll(): Promise<UserEntity[]> {
        // Busca pelos usuários do banco (sem as listas de livros a eles associadas)
        let users = await this.usersRepository.find()

        // Busca pelos livros associados a cada um dos usuários
        let usersWithBooks: UserEntity[] = []
        for (let user of users) {
            let books = await this.bookRepository.find({
                where: {
                    user: user,
                },
            })
            user.books = books
            usersWithBooks.push(user)
        }

        return usersWithBooks
    }

    async findUserById(id: number): Promise<UserEntity> {
        // Busca pelos usuários de id correspondente
        let user = await this.usersRepository.findOne(id)

        // Busca pelos livros associados ao usuário encontrado
        let books = await this.bookRepository.find({
            where: {
                user: user,
            },
        })
        user.books = books

        return user
    }

    async createUser(userToCreate: UserEntity): Promise<UserEntity> {
        console.log('Entrando no createUser()...')
        console.log('userToCreate')
        console.log(userToCreate)
        const user: UserEntity = UserEntity.create()

        let book: BookEntity
        let books: BookEntity[] = []

        for (let bookId of userToCreate.books) {
            book = await this.bookRepository.findOne(bookId)
            console.log('book = ')
            console.log(book)
            books.push(book)
        }

        console.log('books')
        console.log(books)
        user.name = userToCreate.name
        user.books = books

        console.log('user = ')
        console.log(user)

        this.usersRepository.save(user)
        return user
    }

    async returnBooks(userIdAndBooksToReturn: GetAndReturnBooksDto) {
        let book: BookEntity

        // Determinação do usuáio que está devolvendo os livros
        let user = await this.findUserById(userIdAndBooksToReturn.userId)

        // Determinação dos livros que o usuário pegou emprestado
        let borrowedBooks = await this.bookRepository.find({
            where: {
                user: user,
            },
        })

        let borrowBooksIds = borrowedBooks.map(borrowedBook => borrowedBook.id)
        let booksToReturnIds = userIdAndBooksToReturn.booksIds

        console.log('user.books = ')
        console.log(user.books)
        console.log(`borrowBooksIds = ${borrowBooksIds}`)
        console.log(`booksToReturnIds = ${booksToReturnIds}`)
        for (let i in borrowBooksIds) {
            if (booksToReturnIds.includes(borrowBooksIds[i])) {
                user.books.splice(parseInt(i), 1)
            }
        }
        console.log('user = ')
        console.log(user)
        this.usersRepository.save(user)
        return user
    }

    async borrowBooks(userIdAndBooksToBorrow: GetAndReturnBooksDto) {
        let book: BookEntity

        // Determinação do usuário que está pegando os livros emprestado
        let user = await this.findUserById(userIdAndBooksToBorrow.userId)

        // Determinação dos livros que o usuário já pegou emprestado
        let borrowedBooks = await this.bookRepository.find({
            where: {
                user: user,
            },
        })
        let borrowBooksIds = borrowedBooks.map(borrowedBook => borrowedBook.id)

        // Combinação entre os livros já pegos e aqueles a serem pegos
        let booksToBorrowIds = userIdAndBooksToBorrow.booksIds 
        let bookToBorrow: BookEntity
        for (let bookToBorrowId of booksToBorrowIds) {
            if (!borrowBooksIds.includes(bookToBorrowId)){
                bookToBorrow = await this.bookRepository.findOne(bookToBorrowId)
                borrowedBooks.push(bookToBorrow)
            }
        }
        user.books = borrowedBooks

        // Armazenamento do novo usuário, contendo os livros locados
        this.usersRepository.save(user)
        return user
    }

    async deleteUser(id: number) {
        this.usersRepository.delete(id)
    }

    
}
