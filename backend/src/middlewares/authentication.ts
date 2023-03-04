import {
	NextFunction,
	Request,
	Response,
} from 'express'


export default function () {
	return async (req: Request, res: Response, next: NextFunction) => {
		return next()
	}
}


