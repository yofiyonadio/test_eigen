import { BorrowInterface } from 'entities/records/borrow'

type Borrows = {
    '/borrow': {
        post: {
            body: {
                member_id: number
                book_ids: number[]
            }
            response: Promise<BorrowInterface[]>
        }
    }
    '/borrow/return': {
        put: {
            body: {
                member_id: number
                book_ids: number[]
            }
            response: Promise<BorrowInterface[]>
        }
    }
}

export default Borrows
