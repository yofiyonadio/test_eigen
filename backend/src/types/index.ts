import { TYPE_DB_CONFIG } from 'app/database'

export type TYPE_CONFIG = {
    CONFIG_DB: TYPE_DB_CONFIG[]
    CONFIG_SERVER: {
        APP_NAME: string
        PORT: number
        SECRET: string
        ENV: string
    }
}
