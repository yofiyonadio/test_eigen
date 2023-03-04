import { TYPE_DB_CONFIG } from 'app/database'
import { TYPE_SCHEDULER } from 'app/server/scheduler'

export type TYPE_CONFIG = {
    CONFIG_DB: TYPE_DB_CONFIG[]
    CONFIG_SCHEDULER?: TYPE_SCHEDULER[]
    CONFIG_SERVER: {
        APP_NAME: string
        PORT: number
        SECRET: string
        ENV: string
    }
}
