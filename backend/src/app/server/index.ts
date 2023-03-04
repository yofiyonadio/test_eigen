import bodyParser from 'body-parser'
import Express from 'express'
import { DataSource } from 'typeorm'
import session from 'express-session'
import cors from 'cors'
import Router from './router'
import Middleware from '../middleware'
import { Logger as _Logger, Log as _Log } from 'sub_modules/utils/helpers/logger'
import { Errors as ValidatorError } from 'sub_modules/utils/helpers/validator'
import { Errors as RepositoryError } from 'sub_modules/utils/libs/typeorm'
import { ErrorModel } from '../models'
import { v4 } from 'uuid'

const app = Express()
declare global {
	function Logger(...arg: Parameters<typeof _Logger>): void
	function Log(...arg: Parameters<typeof _Log>): void
}

global.Logger = (...arg: Parameters<typeof _Logger>) => _Logger(...arg)
global.Log = (...arg: Parameters<typeof _Log>) => _Log(...arg)

ValidatorError.fn = (error: string): void => {
	throw new ErrorModel('NOT_SATISFIED', 'ERR_100|Parameter not satisfied', error)
}

RepositoryError.duplicateKey = (error: any): void => {
	throw new ErrorModel('NOT_ACCEPTED', 'ERR_110|Duplicate key', error)
}
RepositoryError.notFound = (error: any): void => {
	throw new ErrorModel('NOT_FOUND', 'ERR_101|NULL', error)
}
RepositoryError.notValid = (error: any): void => {
	throw new ErrorModel('NOT_VALID', 'ERR_103|Parameter invalid', error)
}


export default {
	init(connection: DataSource[]) {
		app.use(bodyParser.raw({ limit: '100kb', type: 'text/csv' })) // for csv uploading file
		app.use(bodyParser.json({ limit: '40mb' })) // for parsing application/json
		app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

		app.use(session({
			genid: () => v4(),
			secret: CONFIG().CONFIG_SERVER.SECRET as any,
			resave: false, // jika true, maka akan selalu mengatur ulang session untuk setiap request
			saveUninitialized: true, // jika false, tidak akan menyimpan session jika tidak ada perubahan session
			proxy: true,
			cookie: {
				maxAge: 1000 * 60 * 60, // break session in 1 hour,
				...CONFIG().CONFIG_SERVER.ENV !== 'localhost' ? {
					sameSite: 'none', // jika 'none', maka akan membolehkan cookie diset pada origin domain yg berbeda 
					secure: true, // menyembunyikan cookie dibrowser, set true jika sameSite = 'none'
					httpOnly: true,
				} : {}
			},
			rolling: true
		}))
		app.use(cors({
			origin: true,
			credentials: true,
		}))
		app.options('*', cors({
			origin: true,
			credentials: true,
		}))
		Middleware.init(app)
		Router.init(app)

		app.listen(CONFIG().CONFIG_SERVER.PORT, () => {
			_Logger('Server  ', CONFIG().CONFIG_SERVER.APP_NAME + ' is running on port ' + CONFIG().CONFIG_SERVER.PORT + '!', 'blue')
			_Logger('Server  ', '---------------------------------------------', 'green')
		})
	},
}
