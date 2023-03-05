import {
    config,
} from 'dotenv'
import 'reflect-metadata'

config()

import { DataSource } from 'typeorm'
import * as _Records from './records'
import { SCHEMAS } from './types'
import { EntityUtils, SeederUtils, SetValUtils } from './utils'

import { TYPE_CONFIG as TYPES_CONFIG } from 'types'
import { CONFIG as _CONFIG } from 'app/config'
import { Logger as _Logger, Log as _Log } from 'sub_modules/utils/helpers/logger'

const CONFIG = () => {
    return _CONFIG as TYPES_CONFIG
}

const Logger = (...arg: Parameters<typeof _Logger>) => _Logger(...arg)
const Log = (...arg: Parameters<typeof _Log>) => _Log(...arg);

(async () => {
    const Records = Object.values(_Records)

    const __CONFIG = CONFIG().CONFIG_DB[0]

    const __dataSource = new DataSource({
        type: 'postgres',
        host: __CONFIG.DB_HOST,
        port: __CONFIG.DB_PORT,
        username: __CONFIG.DB_USER,
        password: __CONFIG.DB_PASS,
        logging: true
    })

    const __connection = await __dataSource.initialize()

    const DB: object[] = await __connection.query(`SELECT * FROM pg_database db WHERE db.datname = '${process.env.DB_NAME}'`)
    if (!DB.length) {
        await __connection.query(`CREATE DATABASE "${process.env.DB_NAME}" WITH ENCODING 'UTF8'`)
    }

    const dataSource = new DataSource({
        type: 'postgres',
        host: __CONFIG.DB_HOST,
        port: __CONFIG.DB_PORT,
        database: __CONFIG.DB_NAME,
        username: __CONFIG.DB_USER,
        password: __CONFIG.DB_PASS,
        logging: true,
        entities: Object.keys(Records).map(key => EntityUtils.create(Records[key])),
    })

    await __connection.destroy()
    await dataSource.initialize().then(async connection => {

        const qR = connection.createQueryRunner()
        await qR.connect()
        await qR.startTransaction()

        const _qR = connection.createQueryRunner()
        await _qR.connect()
        await _qR.startTransaction()

        try {
            await Promise.all(Object.values(SCHEMAS).map(async enumss => {
                return _qR.query(`CREATE SCHEMA IF NOT EXISTS ${enumss}`)
            }))

            await _qR.commitTransaction()
        } catch (e) {
            await _qR.rollbackTransaction()
        }

        await _qR.release()

        try {

            await qR.query(`SET TIME ZONE 'Asia/Jakarta'`)

            await qR.connection.synchronize()

            for (const comment of EntityUtils.getCommentQueries()) {
                Logger('DATABASE', 'Creating Comment Foreign Keys')
                await qR.query(comment)
            }

            for (const query of SeederUtils.createSEEDER()) {
                for (const Q of query) {
                    await qR.query(Q)
                }
            }

            await SetValUtils.createSETVAL(qR)

            await qR.commitTransaction()
            await qR.release()
            Logger('DATABASE', 'Success migrate on DB ' + process.env.DB_HOST + ' .......')
        } catch (e) {
            Log(e)
            await qR.rollbackTransaction()
            await qR.release()
        }
    })
})()

