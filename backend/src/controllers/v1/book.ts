import { ControllerModel } from 'app/models'
import { Request, Response } from 'express'
import { Validator } from 'sub_modules/utils/helpers/validator'
import { parseQuerys } from 'sub_modules/utils'
import { Anyses } from 'sub_modules/apiface/_type'
import { Apiface_V1_Books } from 'sub_modules/apiface'
import { BookRepository } from 'app/repositories'

type Apiface = Apiface_V1_Books
class BookController extends ControllerModel {

	route(): Anyses<Apiface> {
		return {
			'/book': {
				get: this.getBooks
			}
		}
	}

	private getBooks = async (req: Request, res: Response):
		Apiface['/book']['get']['response'] =>
		this.transaction(req, res, async transaction => {

			const book: Apiface['/book']['get']['query'] =
				parseQuerys(req, {
					code: 'STRING',
					title: 'STRING',
					author: 'STRING',
					stock: 'NUMBER'
				})

			Validator(book, {
				code: 'string?',
				title: 'string?',
				author: 'string?',
				stock: 'number?'
			})

			return await BookRepository.getBook({
				filter: book,
				option: {
					get: 'MANY',
					getAllWhenNoFilter: true
				}
			}, transaction)
		})

}
export default new BookController()
