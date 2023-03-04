import BaseModel from './_base'

export class PlainRecordModel extends BaseModel {
    public static table: {
        schema: string
        name: string
        comment?: string
    }

    public static columns: { [key: string]: boolean }

    public update<T extends this>(object: {
        [K in keyof T]?: T[K]
    }) {
        Object.keys(object).forEach(key => {
            if (object[key] !== undefined) {
                this[key] = object[key]
            }
        })

        return this
    }
}

export default PlainRecordModel
