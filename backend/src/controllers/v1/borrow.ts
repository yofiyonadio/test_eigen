import { ControllerModel, ErrorModel } from 'app/models'
import { Request, Response } from 'express'
import { Validator } from 'sub_modules/utils/helpers/validator'
import { Anyses } from 'sub_modules/apiface/_type'
import { Apiface_V1_Borrows } from 'sub_modules/apiface'
import { BookRepository, BorrowRepository } from 'app/repositories'
import { momentz } from 'sub_modules/utils/helpers/time'

type Apiface = Apiface_V1_Borrows
class BorrowController extends ControllerModel {

	route(): Anyses<Apiface> {
		return {
			'/borrow': {
				post: this.createBorrow,
			},
			'/borrow/return': {
				put: this.borrowReturn
			}
		}
	}

	private borrowReturn = async (req: Request, res: Response):
		Apiface['/borrow/return']['put']['response'] =>
		this.transaction(req, res, async transaction => {

			const borrow: Apiface['/borrow/return']['put']['body'] =
				req.body

			Validator(borrow, {
				member_id: 'number',
				book_ids: ['array', 'number'],
			})

			const borrows = await BorrowRepository.getBorrow({
				filter: {
					book_id: borrow.book_ids,
					member_id: borrow.member_id,
					status: 'BORROWED',
				},
				option: {
					get: 'MANY'
				}
			}, transaction)

			if (!borrows?.length) {
				throw new ErrorModel('NOT_FOUND', 'ERR_101|NULL', 'borrowed books not found')
			}

			const returns = await BorrowRepository.upserts(borrows.map(borrow => {
				return {
					...borrow,
					status: 'RETURNED',
					returned_at: momentz().toDate(),
					penalized_at: momentz().diff(borrow.created_at, 'days') > 7 ? momentz().toDate() : null as any
				}
			}), transaction)

			const books = await BookRepository.getBook({
				filter: {
					id: borrows.map(borrow => borrow.book_id)
				},
				option: {
					get: 'MANY'
				}
			}, transaction)

			await BookRepository.upserts(books.map(book => {
				return {
					...book,
					stock: book.stock + 1
				}
			}), transaction)

			return returns
		})

	private createBorrow = async (req: Request, res: Response):
		Apiface['/borrow']['post']['response'] =>
		this.transaction(req, res, async transaction => {

			const borrow: Apiface['/borrow']['post']['body'] =
				req.body

			Validator(borrow, {
				member_id: 'number',
				book_ids: ['array', 'number'],
			})

			if (borrow.book_ids.length > 2) {
				throw new ErrorModel('NOT_ACCEPTED', 'ERR_103|Parameter invalid', `can't book more than 2 books`)
			}

			const have_borrow_penalized = await BorrowRepository.getBorrow({
				filter: {
					member_id: borrow.member_id
				},
				option: {
					get: 'ONE',
					is_penalized: true
				}
			}, transaction)


			if (have_borrow_penalized?.id) {
				throw new ErrorModel('NOT_ACCEPTED', 'ERR_106|Try again later', 'user is currently being penalized')
			}

			const books = await BookRepository.getBook({
				filter: {
					id: borrow.book_ids
				},
				option: {
					get: 'MANY'
				}
			}, transaction)

			const out_of_stock_books = books.filter(book => book.stock < 1)

			if (out_of_stock_books.length) {
				throw new ErrorModel('NOT_VALID', 'ERR_105|Result invalid', `book_id's ${out_of_stock_books.map(i => i.id)} out of stocks`)
			}

			const borroweds = await BorrowRepository.inserts(borrow.book_ids.map(book_id => {
				return {
					amount: 1,
					member_id: borrow.member_id,
					book_id,
					status: 'BORROWED'
				}
			}), transaction)

			await BookRepository.upserts(books.map(book => {
				return {
					...book,
					stock: book.stock - 1
				}
			}), transaction)

			return borroweds
		})

}
export default new BorrowController()
