import * as _Records from 'entities/records'
import EntityHelper from 'entities/utils/entity'
import { TYPE_CONFIG } from 'types'

export type CONFIG = TYPE_CONFIG

export const CONFIG = {
    CONFIG_SERVER: {
        APP_NAME: 'Backlien',
        PORT: parseInt(process.env.PORT as any, 10),
        SECRET: '$2a$12$29e0S.0moK/ZXHhZz32ziOtwvvWIaWsP5gzFO/aq3U3gGbt6wXaCG',
        ENV: process.env.ENV
    },
    CONFIG_DB: [
        {
            NAME: 'defaultConnection',
            APPLICATION_NAME: 'Backlien',
            DB_HOST: process.env.DB_HOST,
            DB_PORT: parseInt(process.env.DB_PORT as any, 10),
            DB_NAME: process.env.DB_NAME,
            DB_USER: process.env.DB_USER,
            DB_PASS: process.env.DB_PASS,
            ENTITY: EntityHelper,
            RECORDS: Object.values(_Records),
        }
    ]
}



