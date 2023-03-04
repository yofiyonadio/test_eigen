import { MemberInterface } from 'entities/records/member'

type Members = {
    '/member': {
        get: {
            query: Partial<MemberInterface>,
            response: Promise<(MemberInterface & {
                total_borrowed: number
            })[]>
        }
    }
}

export default Members
