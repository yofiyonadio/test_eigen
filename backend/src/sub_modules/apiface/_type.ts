export type Anyses<T> = {
    [Key in keyof T]: {
        [key in keyof T[Key]]: any
    }
}
