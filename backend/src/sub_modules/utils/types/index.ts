export type ArrayToObject<T extends readonly [...any], X extends {
    value?: X['value']
    key_uppercase?: boolean
} = {
    value: T[number]
    key_uppercase: false
}> = {
        [Key in X['key_uppercase'] extends true ? Uppercase<T[number]> : T[number]]: X['value'] extends null ? T[number] : X['value']
    }

export type NestedRequired<T> = Required<{
    [key in keyof T]: Required<T>[key] extends { [key: string]: any } ? NestedRequired<T[key]> : T[key]
}>


const _SORT_OPTION = ['ASC', 'DESC', 'ASC_NULLS_FIRST', 'DESC_NULLS_FIRST', 'ASC_NULLS_LAST', 'DESC_NULLS_LAST'] as const
type _SORT_OPTION = ArrayToObject<typeof _SORT_OPTION>
export type SORT_OPTION = typeof _SORT_OPTION[number]
export const SORT_OPTION: _SORT_OPTION = {
    ASC: 'ASC',
    DESC: 'DESC',
    ASC_NULLS_FIRST: 'ASC_NULLS_FIRST',
    DESC_NULLS_FIRST: 'DESC_NULLS_FIRST',
    ASC_NULLS_LAST: 'ASC_NULLS_LAST',
    DESC_NULLS_LAST: 'DESC_NULLS_LAST'
}
