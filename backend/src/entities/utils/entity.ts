import { PlainRecordModel } from 'entities/models'
import {
    Entity,
} from 'typeorm'
const comments: any[] = []


export default {
    create(record: typeof PlainRecordModel) {
        const {
            comment,
            schema,
            name,
        } = record.table

        if (comment) {
            comments.push({
                comment,
                schema,
                name,
            })
        }

        Entity({
            schema,
            name,
        })(record)

        return record
    },
    getCommentQueries() {
        // retrieve and delete
        return comments.splice(0, comments.length).map(({
            comment = '',
            schema = 'public',
            name,
        }) => {
            return `COMMENT ON TABLE "${schema}"."${name}" IS E'${comment}'`
        })
    }
}
