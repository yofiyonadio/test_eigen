import RecordModel, { TypeColumns } from '../models/record'

import {
    Column, OneToMany
} from 'typeorm'
import { InterfaceModel } from '../models'
import BorrowRecord from './borrow'

export interface MemberInterface extends InterfaceModel {
    code: string
    name: string
    deleted_at?: Date
}


export class MemberRecord extends RecordModel implements Required<MemberInterface> {

    public static table = {
        schema: 'app',
        name: 'member',
        comment: '@omit create,update,delete',
    }

    public static columns: TypeColumns<MemberInterface> = {
        ...RecordModel.base_columns(),
        code: true,
        name: true,
        deleted_at: true
    }

    @Column({
        ...RecordModel.column_varchar({
            nullable: false,
            length: 4 as any,
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
    name: string

    @Column({
        ...RecordModel.column_timestampz({
            nullable: true
        })
    })
    deleted_at: Date


    // ====================== TYPORM RELATION DEFINITION =======================

    @OneToMany(() => BorrowRecord, borrow => borrow.member, {
        nullable: true,
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    })
    borrows?: BorrowRecord[]

    public seeder(): MemberInterface[] {
        return require('../../../data/member.json').map((member: MemberInterface, n: number) => {
            return {
                ...member,
                id: n + 1
            }
        })
    }

}

export default MemberRecord
