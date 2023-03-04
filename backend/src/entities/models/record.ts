import PlainRecordModel from './plain.record'

import {
    ColumnOptions,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { TypeMap } from 'entities/types'

export type TypeColumns<T> = TypeMap<Required<T>, true>

export default abstract class RecordModel extends PlainRecordModel {

    public static depends_on: string

    public static column_primary = (): [] => {
        return ['identity', { generatedIdentity: 'BY DEFAULT' }] as any
    }

    public static column_date = ({
        nullable,
        defaults,
    }: {
        nullable: boolean,
        defaults?: 'TODAY',
    }): ColumnOptions => {
        return {
            nullable,
            type: 'date',
            ...defaults === 'TODAY' ? {
                default: () => 'CURRENT_DATE',
            } : {}
        }
    }

    /**
     * 
     * @param defaults default false 
     * @returns 
     */
    public static column_boolean = ({
        defaults,
    }: {
        defaults?: boolean,
    } = {}): ColumnOptions => {
        return {
            nullable: false,
            type: 'boolean',
            ...defaults ? {
                default: defaults,
            } : {
                default: false
            }
        }
    }

    public static column_enum = <T extends object>({
        nullable,
        defaults,
        enums
    }: {
        nullable: boolean,
        defaults?: T[keyof T],
        enums: T
    }): ColumnOptions => {
        return {
            nullable,
            enum: Object.values(enums),
            type: 'enum',
            ...defaults ? {
                default: defaults,
            } : {}
        }
    }

    public static column_numeric = ({
        nullable,
        defaults,
        unique
    }: {
        nullable: boolean
        defaults?: number
        unique?: boolean
    }): ColumnOptions => {
        return {
            nullable,
            type: 'numeric',
            ...defaults ? {
                default: defaults,
            } : {},
            unique: unique ?? false
        }
    }

    public static column_integer = ({
        nullable,
        defaults,
        unique
    }: {
        nullable: boolean
        defaults?: number
        unique?: boolean
    }): ColumnOptions => {
        return {
            nullable,
            type: 'integer',
            ...defaults ? {
                default: defaults,
            } : {},
            unique: unique ?? false
        }
    }

    public static column_text = ({
        nullable,
        defaults,
        unique
    }: {
        nullable: boolean
        defaults?: string
        unique?: boolean
    }): ColumnOptions => {
        return {
            nullable,
            type: 'text',
            ...defaults ? {
                default: defaults,
            } : {},
            unique: unique ?? false
        }
    }

    /**
     * 
     * @param length default 50
     * @returns 
     */
    public static column_varchar = ({
        nullable,
        defaults,
        length,
        unique
    }: {
        nullable: boolean
        defaults?: string
        length?: '10' | '50' | '255' | '500' | '1000'
        unique?: boolean
    }): ColumnOptions => {
        return {
            nullable,
            type: 'varchar',
            ...defaults ? {
                default: defaults,
            } : {},
            length,
            unique: unique ?? false
        }
    }

    public static column_uuid = ({
        nullable,
        defaults,
        unique
    }: {
        nullable: boolean
        defaults?: 'uuid'
        unique?: boolean
    }): ColumnOptions => {
        return {
            nullable,
            type: 'uuid',
            ...defaults === 'uuid' ? {
                default: () => 'gen_random_uuid()',
            } : {},
            unique: unique === false ? false : true
        }
    }

    public static column_json = ({
        defaults
    }: {
        defaults?: { [key: string]: any }
    } = {}): ColumnOptions => {
        return {
            nullable: false,
            type: 'jsonb',
            ...defaults ? {
                default: defaults
            } : {
                default: {}
            }
        }
    }

    public static column_timestampz = ({
        nullable,
        defaults
    }: {
        nullable: boolean
        defaults?: 'NOW'
    }): ColumnOptions => {
        return {
            nullable,
            type: 'timestamptz',
            ...defaults === 'NOW' ? {
                default: () => 'CURRENT_TIMESTAMP',
            } : {}
        }
    }

    public static base_columns(): {
        id: true,
        created_at: true,
        updated_at: true
    } {
        return {
            id: true,
            created_at: true,
            updated_at: true
        }
    }

    @PrimaryGeneratedColumn('identity', { generatedIdentity: 'BY DEFAULT' })
    public id: number

    @CreateDateColumn({
        type: 'timestamp with time zone',
        default: () => 'CURRENT_TIMESTAMP',
    })
    public created_at: Date

    @UpdateDateColumn({
        nullable: true,
        type: 'timestamp with time zone',
    })
    public updated_at: Date

    public seeder(): { [Key: string]: any }[] {
        return []
    }

}
