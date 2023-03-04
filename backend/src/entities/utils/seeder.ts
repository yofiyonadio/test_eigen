import moment from 'moment'
import * as _Records from 'entities/records'
import func from './function'
import { isObject } from '../../sub_modules/utils/helpers/object'

const __Records = Object.values(_Records).map(record => {
    try {
        const instanceRecord = new record()
        const schema = record['table']['schema']
        const table = record['table']['name']
        return {
            schema,
            table,
            seeder: instanceRecord['seeder'](),
            depends_on: record['depends_on'] ? record['depends_on'] as string : undefined
        }
    } catch (e) {
        return null
    }
})

const Records = __Records.reduce((init, i, n, arr) => {
    if (i) {
        if (i.depends_on) {
            if (!arr.some(_ => (_?.schema + '.' + _?.table) === i.depends_on)) {
                throw new Error(`depends_on '${i.depends_on}' not found!`)
            }
            const idx = init.findIndex(_ => (_?.schema + '.' + _?.table) === i.depends_on)
            const copy = init[idx]
            if (copy) { init.splice(idx, 1) }
            return copy ? [...init, i, copy] : [...init, i]
        }
        return [...init, {
            ...i,
        }]
    }
    return init
}, [] as typeof __Records).reverse()

function toDateTimeString(date: Date | string) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

function SQLString(text: string | any): string {
    return `'` + replaceAll(text + '', `'`, `''`) + `'`
}

function SQLObject(text: string | any): string {
    return '"' + text + '"'
}

function SQLValue(text: string | any): string {
    return (text instanceof Date) ? SQLString(toDateTimeString(text)) : text === null ? 'null' : text === undefined ? 'null' : isObject(text) ? SQLString(JSON.stringify(text)) : SQLString(text)
}

function replaceAll(string: string, old_value: string, new_value: string) {
    return string.replace(new RegExp(old_value, 'g'), new_value)
}

function chunckArray(array: any[], chunkSize: number) {
    const chunck_array: any[] = []
    for (let i = 0; i < array.length; i += chunkSize) {
        const chunk = array.slice(i, i + chunkSize)
        chunck_array.push(chunk)
    }
    return chunck_array
}


export default {
    _createSEEDER(schema: string, table: string, datas: any[]) {
        const values = [...datas.map((_data: any, i: number) => {
            const _inserts = Object.values(Object.keys(_data).reduce((init, _key) => {
                return _key === '_key' ? { ...init } : {
                    ...init,
                    [_key]: _data[_key]
                }
            }, {})).map(val => SQLValue(val))
            return (`(${_inserts})`)
        })].join(',')

        const data = Object.keys(datas[0]).reduce((init, _key) => {
            return _key === '_key' ? { ...init } : {
                ...init,
                [_key]: datas[0][_key]
            }
        }, {})

        if (!data) {
            return ''
        }

        const _target = `"${schema}"."${table}"`
        const _columns = Object.keys(data).map(col => SQLObject(col)).join(', ')
        const _updates = Object.keys(data).map(col => SQLObject(col) + ' = excluded.' + SQLObject(col))
        const Q = `INSERT INTO ${_target} (${_columns})
			VALUES ${values}
			ON CONFLICT (${datas[0]['_key'] ? datas[0]['_key'].map((i: any) => SQLObject(i)) : SQLObject('id')}) DO UPDATE
			SET ${_updates}
			;`
        return func.formatSpace(Q)
    },
    createSEEDER() {
        return Object.values(Records).map(Record => {
            const schema = Record?.schema
            const table = Record?.table
            const datas = chunckArray(Record?.seeder as any, 1000)

            return datas.map(data => this._createSEEDER(schema, table, data))

        })
    },

}
