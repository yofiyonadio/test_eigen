import { ControllerModel } from 'app/models'
import { BorrowRepository } from 'app/repositories'
import { Request, Response } from 'express'
import { momentz } from 'sub_modules/utils/helpers/time'

class BaseController extends ControllerModel {

	route() {
		return {
			'/': {
				get: this.base
			}
		}
	}

	private base = async (req: Request, res: Response) =>
		this.transaction(req, res, async trx => {
			const borrow = await BorrowRepository.getBorrow({
				filter: {
					id: 2
				},
				option: {
					get: 'ONE'
				}
			}, trx)
			return {
				...borrow,
				test: momentz().diff(borrow.created_at, 'days')
			}
			return true
		})

}

export default new BaseController()
