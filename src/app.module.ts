import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { BooksModule } from './books/books.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './db/user.entity'
import { BookEntity } from './db/book.entity'

@Module({
    imports: [
        UsersModule,
        BooksModule,
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'admin',
            database: 'db-test',
            entities: [UserEntity, BookEntity],
            synchronize: true,
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
