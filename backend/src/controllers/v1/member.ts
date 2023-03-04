import { ControllerModel } from 'app/models'
import { Request, Response } from 'express'
import { Validator } from 'sub_modules/utils/helpers/validator'
import { parseQuerys } from 'sub_modules/utils'
import { Anyses } from 'sub_modules/apiface/_type'
import { Apiface_V1_Members } from 'sub_modules/apiface'
import { MemberRepository } from 'app/repositories'
import { blackListKey } from 'sub_modules/utils/helpers/object'

type Apiface = Apiface_V1_Members
class MemberController extends ControllerModel {

	route(): Anyses<Apiface> {
		return {
			'/member': {
				get: this.getMembers
			}
		}
	}

	private getMembers = async (req: Request, res: Response):
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
					getAllWhenNoFilter: true,
					with_active_borrow: true
				}
			}, transaction).then(members => {
				return members.map(member => {
					return {
						...blackListKey(member, ['borrows']),
						total_borrowed: member.borrows?.length ?? 0
					}
				})
			})
		})

}
export default new MemberController()
