import { Request } from 'express'
import { isArray, trimObject } from './helpers/object'
import * as TimeHelper from './helpers/time'
import { SORT_OPTION } from './types'

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

export function SQLString(text: string | any): string {
    return `'` + text + `'`
}

export function SQLSearch(text: string | any): string {
    return `'%` + text + `%'`
}

export function SQLIn(values: any[] | any): string {
    return '(' + (isArray(values) ? values.map((i: any) => SQLValue(i)) : SQLValue(values)) + ')'
}

export function SQLObject(text: string | any): string {
    return '"' + text + '"'
}

export function SQLDate(text: string | Date, typeOnly?: boolean): string {
    const _dateStr = (_text: string | Date, pattern: 'date' | 'datetime') => {
        const _value = SQLString(TimeHelper.format(_text, pattern === 'datetime' ? 'YYYY-MM-DD HH:mm:ss Z' : 'YYYY-MM-DD'))
        const _type = pattern === 'datetime' ? '::TIMESTAMPTZ' : '::DATE'
        return typeOnly ? _type : (_value + _type)
    }
    return (text instanceof Date) ? _dateStr(text, 'datetime') : text.split(' ').length < 2 ? _dateStr(text, 'date') : _dateStr(text, 'datetime')
}

export function SQLValue(text: any): string {
    return (text instanceof Date) ? SQLDate(text) : text === null ? 'NULL' : text === undefined ? 'NULL' : isNumber(text) ? text : isBoolean(text) ? text : SQLString(text)
}

export function SQLClean(string: any): string {
    return string.replace(/[\n|\r|\t]+/g, ' ').replace(/\s\s+/g, ' ').replace(/ ,/g, ',').replace(/, /g, ',').replace(/,  /g, ',').replace(/[;;]+/g, ';')
}

export async function Try(func: () => any, catch_value?: any) {
    try {
        return await func()
    } catch {
        return catch_value
    }
}

export function ThrowNull<T>(data: T) {
    try {
        if (isNull(data)) {
            throw new Error('NOT FOUND')
        }
        return data
    } catch (e) {
        throw e
    }
}

export function isNumber(value: any): boolean {
    return typeof value === 'number' && !isNaN(value)
}

export function isNumberOrNull(value: any): boolean {
    if (isNumber(value) || isNull(value)) {
        return true
    }
    return false
}

export function toNumber(value: any): number {
    return parseInt(value, 10)
}

export function delay(ms: number) {
    return new Promise(_ => setTimeout(_, ms))
}

export function rangeNumber(value: number, start: number, end: number): boolean {
    return value >= start && value <= end
}

export function random(min: number, max: number): number
export function random(length: number, with_zero?: boolean): number
export function random(min_or_length: number, max_or_with_zero?: number | boolean, with_zero?: boolean) {
    const is_random_length = typeof max_or_with_zero === 'boolean' || max_or_with_zero === undefined
    const __length = min_or_length || 1
    const __min = min_or_length
    const __max = max_or_with_zero as number
    const __with_zero = (is_random_length ? max_or_with_zero : with_zero) ?? true

    const randoms = new Array(is_random_length ? __length : 1).fill(0).map((_, i) => {
        let n = Math.floor(Math.random() * (is_random_length ? 10 : (__max + 1)))
        if (is_random_length) {
            if (n < 1 && i < 1 && __length > 1) {
                n = n + 1
            }
            if (n < 1 && !__with_zero) {
                n = n + 1
            }
        } else {
            if (__min) {
                if (n < __min) {
                    n = __min
                }
            }
        }
        return n
    })
    return parseInt(randoms.join(''), 10)
}

export function randomString(length: number): string {
    return new Array(length).fill(0).reduce((init, _, n) => {
        const letter = letters[random(0, letters.length - 1)]
        const rand = random(1, 3)
        return init + (rand % 3 === 0 ? random(1) : rand % 2 === 0 ? letter.toLocaleLowerCase() : letter)
    }, '')
}

export function roundRoot(number: number, round: number) {
    return number - (Math.floor(number / round) * round)
}

export function calcNumberByPercen(num: number, operator: '+' | '-' | '*' | '/', percen: number) {
    const a = num
    const b = percen / 100
    return operator === '+' ?
        a + (a * (b)) :
        operator === '-' ?
            a - (a * (b)) :
            operator === '*' ?
                (a * (a * (b))) / 100 :
                (a / (a * (b))) * 100
}

export function calcPercenByNumber(num: number, total: number) {
    return (num / total) * 100
}

export function isString(value: any): boolean {
    return typeof value === 'string'
}

export function toString(value: any): string {
    return value + ''
}

export function isBoolean(value: any): boolean {
    return value === true || value === false ? true : false
}

export function toBoolean(value: any): boolean {
    if (value === 'true') return true
    if (value === 'false') return false
    if (value === 1) return true
    if (value === 0) return false
    throw new Error(`toBoolean(): cannot convert value to boolean`)
}

export function isDate(value: any): boolean {
    return value instanceof Date && !isNaN(value as any)
}

export function isNull(value: any): boolean {
    return value === null || value === undefined
}

export function replaceAll(string: string, old_value: string, new_value: string) {
    return string.replace(new RegExp(old_value, 'g'), new_value)
}

export function trimDomain(url: string) {
    return url
        .replace(/https:|http:/g, '')
        .replace('//', '')
        .split('/')?.[0]
}

export function getLetterByNumber(number: number): string {
    const offset = Math.ceil(number / letters.length) - 1
    const last = letters[(number - 1) % letters.length]
    return (offset ? getLetterByNumber(offset) : '') + last
}

export function getNumberByLetter(letter: string) {
    return letter.split('').reverse().reduce((init, l, n) => {
        const index = letters.findIndex(i => i === l)
        const power = letters.length ** n
        return n > 0 ? init + (power * (index + 1) + 0) : (power + index)
    }, 0)
}


type TypeCostumPrimitive = 'NUMBER' | 'STRING' | 'BOOL' | 'DATE' | 'DATE_STRING' | 'OBJECT' | 'ARRAY' | 'ARRAY_NUMBER' | 'ENUM' | 'SORT' | 'ANY'
function _parseQuery<T extends TypeCostumPrimitive>(value: any, type: T):
    T extends 'NUMBER' ? number :
    T extends 'STRING' ? string :
    T extends 'DATE' ? Date :
    T extends 'DATE_STRING' ? string :
    T extends 'BOOL' ? boolean :
    T extends 'OBJECT' ? { [Key: string]: any } :
    T extends 'ARRAY' ? string[] :
    T extends 'ARRAY_NUMBER' ? number[] :
    T extends 'SORT' ? SORT_OPTION :
    any {
    switch (type) {
        case 'NUMBER': {
            return isNull(value) ? undefined : toNumber(value) as any
        }
        case 'STRING': {
            return isNull(value) ? undefined : value
        }
        case 'BOOL': {
            return isNull(value) ? undefined : value === 'true' ? true : value === 'false' ? false : value
        }
        case 'DATE': {
            return isNull(value) ? undefined : TimeHelper.momentz(value).toDate() as any
        }
        case 'DATE_STRING': {
            return isNull(value) ? undefined : value
        }
        case 'OBJECT': {
            return isNull(value) ? undefined : value
        }
        case 'ARRAY': {
            return isNull(value) ? undefined : isString(value) ? value.split(',') : value
        }
        case 'ARRAY_NUMBER': {
            return isNull(value) ? undefined : isString(value) ? value.split(',').map(i => toNumber(i)) : value
        }
        case 'ENUM': {
            return isNull(value) ? undefined : value
        }
        case 'SORT': {
            return isNull(value) ? undefined : value
        }
        case 'ANY': {
            return isNull(value) ? undefined : value
        }
        default: {
            throw new Error('Query type not valid!')
        }
    }
}

export function parseQuerys<T extends Record<string, TypeCostumPrimitive>>(req: Request, _object: T): {
    [Key in keyof T]:
    T[Key] extends 'NUMBER' ? number :
    T[Key] extends 'STRING' ? string :
    T[Key] extends 'DATE' ? Date :
    T[Key] extends 'DATE_STRING' ? Date :
    T[Key] extends 'BOOL' ? boolean :
    T[Key] extends 'OBJECT' ? { [Key: string]: any } :
    T[Key] extends 'ARRAY' ? any[] :
    T[Key] extends 'ARRAY_NUMBER' ? number[] :
    T[Key] extends 'SORT' ? SORT_OPTION :
    any
} {
    return trimObject(Object.keys(_object).reduce((init, key) => {
        return {
            ...init,
            [key]: req?.query[key] === 'NULL' ? null : _parseQuery(req?.query[key], _object[key])
        }
    }, {})) as any
}

export function parseRequest<T extends Record<string, TypeCostumPrimitive>>(req: { [key: string]: any }, _object: T): {
    [Key in keyof T]:
    T[Key] extends 'NUMBER' ? number :
    T[Key] extends 'STRING' ? string :
    T[Key] extends 'DATE' ? Date :
    T[Key] extends 'BOOL' ? boolean :
    T[Key] extends 'OBJECT' ? { [Key: string]: any } :
    T[Key] extends 'ARRAY' ? any[] :
    any
} {
    return trimObject(Object.keys(_object).reduce((init, key) => {
        return {
            ...init,
            [key]: _parseQuery(req[key], _object[key])
        }
    }, {})) as any
}

export function parseBody<T extends Record<string, 'NUMBER' | 'STRING' | 'BOOL' | 'DATE' | 'OBJECT' | 'ARRAY' | 'ENUM' | 'ANY'>>(req: Request, _object: T): {
    [Key in keyof T]:
    T[Key] extends 'NUMBER' ? number :
    T[Key] extends 'STRING' ? string :
    T[Key] extends 'DATE' ? Date :
    T[Key] extends 'BOOL' ? boolean :
    T[Key] extends 'OBJECT' ? { [Key: string]: any } :
    T[Key] extends 'ARRAY' ? any[] :
    any
} {
    return trimObject(Object.keys(_object).reduce((init, key) => {
        return {
            ...init,
            [key]: req.body[key]
        }
    }, {})) as any
}

export function camelCase(str: string) {
    return str?.split(' ').reduce((init, s) => {
        return (init ? init + ' ' : init) + s[0].toUpperCase() + s.slice(1, s.length).toLowerCase()
    }, '')
}

export function currency(number: number) {
    return number.toString().replace(/,/g, '').replace(/(\d)(?=(\d{3})+$)/g, '$1.')
}


