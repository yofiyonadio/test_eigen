import { ControllerModel } from 'app/models'
import { Request, Response } from 'express'

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
			return true
		})

}

export default new BaseController()
