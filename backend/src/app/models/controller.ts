import ErrorModel, { ERRORS } from './error'
import code from 'utils/constants/code'
import {
	Request,
	Response,
} from 'express'
import { EntityManager, QueryRunner } from 'typeorm'
import { Connections } from 'app/database'
import { parseNull } from 'sub_modules/utils/helpers/object'


class ControllerModel {

	protected static __type = 'controller'

	responder(response: Response): any {
		return (data: any) => {
			response.json(parseNull(data))
			response.end()
			return
		}
	}


	catcher(response: Response) {
		return async (err: Error | ErrorModel) => {
			let error: any = err
			if (err instanceof ErrorModel) {
				return response.status(this.getStatus(err.type)).json(error)
			}
			if (err instanceof Error) {
				error = new ErrorModel('UNKNOWN', 'ERR_099|Unhandled error occured', {
					name: err.name,
					message: err.message,
				})
				return response.status(code.httpstatus.internalerror).json(error)
			}
			error = new ErrorModel('UNKNOWN', 'ERR_099|Unhandled error occured', err)
			response.status(code.httpstatus.internalerror).json(error)
			response.end()
			return
		}
	}


	route(): any {
		return
	}

	async transaction<T extends (...trx: EntityManager[]) => Promise<any>>(req: Request, res: Response, fn: T): Promise<Awaited<ReturnType<T>>> {
		let qRs: QueryRunner[] = []
		try {
			qRs = Connections.map(Q => Q.createQueryRunner())
			await Promise.all(qRs.map(async qR => {
				await qR.connect()
				await qR.startTransaction()
			}))

			const result = await fn(...qRs.map(qR => qR.manager))
			await Promise.all(qRs.map(async qR => {
				await qR.commitTransaction()
				await qR.release()
			}))
			return this.responder(res)(result)
		} catch (err) {
			await Promise.all(qRs.map(async qR => {
				await qR.rollbackTransaction()
				await qR.release()
			}))
			Logger(this, err)
			return await this.catcher(res)(err) as any

		}
	}

	private getStatus(type: ERRORS) {
		switch (type) {
			case ERRORS.UNKNOWN:
			default:
				return code.httpstatus.internalerror

			case ERRORS.NODATA:
				return code.httpstatus.notfound

			case ERRORS.NOT_AUTHORIZED:
				return code.httpstatus.unauthorized

			case ERRORS.NOT_FOUND:
				return code.httpstatus.notfound

			case ERRORS.NOT_SATISFIED:
				return code.httpstatus.badrequest

			case ERRORS.NOT_VALID:
				return code.httpstatus.badrequest

			case ERRORS.NOT_VERIFIED:
				return code.httpstatus.forbidden

			case ERRORS.NOT_ACCEPTED:
				return code.httpstatus.conflict
		}
	}
}


export default ControllerModel
