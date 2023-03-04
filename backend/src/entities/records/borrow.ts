import RecordModel, { TypeColumns } from '../models/record'

import {
    Column, JoinColumn, ManyToOne
} from 'typeorm'
import { InterfaceModel } from '../models'
import { ArrayToObject } from 'entities/types'
import MemberRecord from './member'
import BookRecord from './book'

const _BORROW_STATUS = ['BORROWED', 'RETURNED'] as const
type _BORROW_STATUS = ArrayToObject<typeof _BORROW_STATUS>
export type BORROW_STATUS = typeof _BORROW_STATUS[number]
export const BORROW_STATUS: _BORROW_STATUS = {
    BORROWED: 'BORROWED',
    RETURNED: 'RETURNED',
}

export interface BorrowInterface extends InterfaceModel {
    member_id: number
    book_id: number
    amount: number
    status: BORROW_STATUS
    returned_at?: Date
    penalized_at?: Date
}


export class BorrowRecord extends RecordModel implements Required<BorrowInterface> {

    public static table = {
        schema: 'app',
        name: 'borrow',
        comment: '@omit create,update,delete',
    }

    public static columns: TypeColumns<BorrowInterface> = {
        ...RecordModel.base_columns(),
        member_id: true,
        book_id: true,
        amount: true,
        status: true,
        returned_at: true,
        penalized_at: true,
    }

    @Column({
        ...RecordModel.column_integer({
            nullable: false,
        })
    })
    member_id: number

    @Column({
        ...RecordModel.column_integer({
            nullable: false,
        })
    })
    book_id: number

    @Column({
        ...RecordModel.column_integer({
            nullable: false,
        })
    })
    amount: number

    @Column({
        ...RecordModel.column_enum({
            nullable: false,
            enums: BORROW_STATUS
        })
    })
    status: BORROW_STATUS

    @Column({
        ...RecordModel.column_timestampz({
            nullable: true,
        })
    })
    returned_at: Date

    @Column({
        ...RecordModel.column_timestampz({
            nullable: true,
        })
    })
    penalized_at: Date


    // ====================== TYPORM RELATION DEFINITION =======================

    @ManyToOne(() => MemberRecord, member => member.borrows, {
        nullable: false,
    })
    @JoinColumn({
        name: 'member_id',
    })
    member?: MemberRecord

    @ManyToOne(() => BookRecord, book => book.borrows, {
        nullable: false,
    })
    @JoinColumn({
        name: 'book_id',
    })
    book?: BookRecord

}

export default BorrowRecord
