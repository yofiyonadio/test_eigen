import { MemberInterface } from 'entities/records/member'
import { TypeInsert } from 'entities/types'

type Members = {
    '/member': {
        get: {
            query: Partial<MemberInterface>,
            response: Promise<MemberInterface[]>
        }
        post: {
            body: TypeInsert<MemberInterface>
            response: Promise<MemberInterface>
        }
    }
}

export default Members
