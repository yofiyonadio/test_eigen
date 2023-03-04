import { ControllerModel } from 'app/models'
import { Request, Response } from 'express'
import { Validator } from 'sub_modules/utils/helpers/validator'
import { parseQuerys } from 'sub_modules/utils'
import { Anyses } from 'sub_modules/apiface/_type'
import { Apiface_V1_Members } from 'sub_modules/apiface'
import { MemberRepository } from 'app/repositories'

type Apiface = Apiface_V1_Members
class MemberController extends ControllerModel {

	route(): Anyses<Apiface> {
		return {
			'/member': {
				post: this.createMember,
				get: this.getMember
			}
		}
	}

	private getMember = async (req: Request, res: Response):
		Apiface['/member']['get']['response'] =>
		this.transaction(req, res, async transaction => {

			const member: Apiface['/member']['get']['query'] =
				parseQuerys(req, {
					id: 'NUMBER',
					code: 'STRING',
					name: 'STRING'
				})

			Validator(member, {
				id: 'number?',
				code: 'string?',
				name: 'string?'
			})

			return await MemberRepository.getMember({
				filter: member,
				option: {
					get: 'MANY',
					getAllWhenNoFilter: true
				}
			}, transaction)
		})


	private createMember = async (req: Request, res: Response):
		Apiface['/member']['post']['response'] =>
		this.transaction(req, res, async transaction => {

			const member: Apiface['/member']['post']['body'] =
				req.body
			Validator(member, {
				code: 'string',
				name: 'string'
			})
			return await MemberRepository.insert(member, transaction)
		})

}
export default new MemberController()
