import {
    DataSource, EntityManager, QueryRunner
} from 'typeorm'

import { promiseReduce } from 'sub_modules/utils/helpers/object'

export let Connections: DataSource[] = []

export type TYPE_DB_CONFIG = {
    NAME: string,
    APPLICATION_NAME: string,
    DB_HOST: any
    DB_PORT: any
    DB_NAME: any
    DB_USER: any
    DB_PASS: any
    RECORDS: object
    ENTITY: object
}

export async function trx<T extends (...trx: EntityManager[]) => Promise<any>>(fn: T): Promise<any> {
    const qRs = Connections.map(Connection => Connection.createQueryRunner())
    await Promise.all(qRs.map(async qR => {
        await qR.connect()
        await qR.startTransaction()
    }))

    try {
        const result = await fn(...qRs.map(qR => qR.manager))
        await Promise.all(qRs.map(async qR => {
            await qR.commitTransaction()
            await qR.release()
        }))

        return result
    } catch (err) {
        Logger(this, err)
        await trxRollback(qRs)
        throw err
    }
}

export async function trxRollback(qRs: (QueryRunner | EntityManager)[]) {
    await Promise.all(qRs.map(async qR => {
        const __qR = ((qR as EntityManager)?.queryRunner || qR) as QueryRunner
        await __qR.rollbackTransaction()
        await __qR.release()
    }))
}

export default {
    async init(config: TYPE_DB_CONFIG[]) {
        const conns = await promiseReduce(config, async c => await DBConnector(c))
        Logger('Database', 'Connection has been established successfully!', 'blue')
        return conns
    }
}

async function DBConnector({
    NAME,
    APPLICATION_NAME,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_USER,
    DB_PASS,
    RECORDS,
    ENTITY,
}: TYPE_DB_CONFIG) {
    const dataSource = new DataSource({
        name: NAME,
        applicationName: APPLICATION_NAME,
        type: 'postgres',
        ssl: DB_HOST !== 'localhost' && DB_HOST !== 'postgres_backlien' ? { rejectUnauthorized: false } : false,
        host: DB_HOST,
        port: parseInt(DB_PORT as any, 10),
        database: DB_NAME,
        username: DB_USER,
        password: DB_PASS,
        logging: ['error', 'warn', 'info', 'log'],
        synchronize: false,
        entities: [...Object.values(RECORDS).map(record => (ENTITY as any).create(record as any))]
    })
    const connection = await dataSource.initialize()
    Connections = [
        ...Connections,
        connection
    ]

    const qR = connection.createQueryRunner()
    await qR.connect()

    Logger('Database', 'Connect to DB :::> ' + DB_HOST + ' ' + DB_NAME, 'amber')

    await qR.release()
    return connection
}
