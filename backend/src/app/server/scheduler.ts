import cron from 'node-cron'
import { promiseReduce } from 'sub_modules/utils/helpers/object'


type SECONDS = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
    | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19
    | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29
    | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39
    | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49
    | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59

type HOURS = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
    | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19
    | 20 | 21 | 22 | 23

type DAYS = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
    | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19
    | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29
    | 30 | 31

type WEEKS = 0 | 1 | 2 | 3 | 4 | 5 | 6

type MONTHS = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export type TYPE_SCHEDULER = {
    schedule: {
        seconds?: SECONDS | '*' | `*/${SECONDS}`,
        minutes?: SECONDS | '*' | `*/${SECONDS}`,
        hours?: HOURS | '*' | `*/${HOURS}`,
        days?: DAYS | '*' | `*/${DAYS}`,
        weeks?: WEEKS | '*' | `*/${WEEKS}`,
        months?: MONTHS | '*' | `*/${MONTHS}`,
    },
    func: () => Promise<any>,
    name: string
}


class Scheduler {

    async initialize(schedules: TYPE_SCHEDULER[]) {
        await promiseReduce(schedules, async schedule => {
            this.schedule({
                schedule: schedule.schedule,
                func: schedule.func,
                name: schedule.name
            })
        })
    }

    // ============================ PRIVATES ============================
    private schedule({ schedule, func, name }: TYPE_SCHEDULER) {
        const _second = schedule.seconds ? schedule.seconds : (schedule.weeks || schedule.months || schedule.days || schedule.hours || schedule.minutes) ? 0 : '*'
        const _minute = schedule.minutes ? schedule.minutes : (schedule.weeks || schedule.months || schedule.days || schedule.hours) ? 0 : '*'
        const _hour = schedule.hours ? schedule.hours : (schedule.weeks || schedule.months || schedule.days) ? 0 : '*'
        const _day = schedule.days ? schedule.days : schedule.months ? 1 : '*'
        const _month = schedule.months ? schedule.months : '*'
        const _weeks = schedule.weeks ? schedule.weeks : '*'
        if (process.env.CRON === 'true') {
            return cron.schedule(`${_second} ${_minute} ${_hour} ${_day} ${_month} ${_weeks}`, async () => {
                try {
                    await func()
                } catch (e) {
                    Logger(this, e)
                }
            })
        }
        return
    }
}

export default new Scheduler()

