import { ControllerModel } from 'app/models'
import { Request, Response } from 'express'

class RootController extends ControllerModel {

	public root = async (req: Request, res: Response):
		Promise<any> =>
		res.type('html').send(`
		<html>
		<head>
			<title>${CONFIG().CONFIG_SERVER.APP_NAME}</title>
		</head>
		<body>
			<p>${CONFIG().CONFIG_SERVER.APP_NAME} is running fine, OK!</p>
			<p style="color: #fff;">${CONFIG().CONFIG_SERVER.PORT}</p>
		</body>
		</html>
			`)

}
export default new RootController()
