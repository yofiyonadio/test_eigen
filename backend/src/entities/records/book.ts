import RecordModel, { TypeColumns } from '../models/record'

import {
    Column, OneToMany
} from 'typeorm'
import { InterfaceModel } from '../models'
import BorrowRecord from './borrow'

export interface BookInterface extends InterfaceModel {
    code: string
    title: string
    author: string
    stock: number
    deleted_at?: Date
}


export class BookRecord extends RecordModel implements Required<BookInterface> {

    public static table = {
        schema: 'app',
        name: 'book',
        comment: '@omit create,update,delete',
    }

    public static columns: TypeColumns<BookInterface> = {
        ...RecordModel.base_columns(),
        code: true,
        title: true,
        author: true,
        stock: true,
        deleted_at: true,
    }

    @Column({
        ...RecordModel.column_varchar({
            nullable: false,
            length: 6 as any,
            unique: true
        })
    })
    code: string

    @Column({
        ...RecordModel.column_varchar({
            nullable: false,
            length: '255',
        })
    })
    title: string


    @Column({
        ...RecordModel.column_varchar({
            nullable: false,
            length: '50',
        })
    })
    author: string

    @Column({
        ...RecordModel.column_integer({
            nullable: false,
        })
    })
    stock: number

    @Column({
        ...RecordModel.column_timestampz({
            nullable: true
        })
    })
    deleted_at: Date


    // ====================== TYPORM RELATION DEFINITION =======================

    @OneToMany(() => BorrowRecord, borrow => borrow.book, {
        nullable: true,
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    })
    borrows?: BorrowRecord[]

    public seeder(): BookInterface[] {
        return require('../../../data/book.json').map((book: BookInterface, n: number) => {
            return {
                ...book,
                id: n + 1
            }
        })
    }

}

export default BookRecord
