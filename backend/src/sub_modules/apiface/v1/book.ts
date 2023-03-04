import { BookInterface } from 'entities/records/book'

type Books = {
    '/book': {
        get: {
            query: Partial<BookInterface>,
            response: Promise<BookInterface[]>
        }
    }
}

export default Books
