import { ControllerModel } from '../models'
import Controllers from 'controllers'
import { Application } from 'express'


export default {
	init(app: Application) {
		app.route('/').all(Controllers.common.CommonRootController.root)
		Object.keys(Controllers).map(type => {
			const Route = Object.values(Controllers[type]).map((controller: ControllerModel) => {
				return controller.route()
			}).reduce((init, i) => {
				return {
					...init,
					...i
				}
			}, {})

			Object.keys(Route).forEach(key => {
				Object.keys(Route[key]).forEach(method => {
					let _key = key

					if (type !== 'common') {
						_key = `/${type}${key}`
					}

					app[method](_key, Route[key][method])
				})
			})
		})
		app.route('*').all(Controllers.common.CommonNotFoundController.notFound)
	},
}
