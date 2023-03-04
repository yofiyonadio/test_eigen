import RepositoryModel, { GETTER, OPTION, Returned, TypeFilter } from 'sub_modules/utils/libs/typeorm'
import { EntityManager, SelectQueryBuilder } from 'typeorm'
import { TypeInsert, TypeUpdate } from 'entities/types'
import MemberRecord, { MemberInterface } from 'entities/records/member'
import BorrowRecord, { BorrowInterface, BORROW_STATUS } from 'entities/records/borrow'


class MemberRepository extends RepositoryModel {

	static __displayName = 'MemberRepository'

	// ============================= INSERT =============================

	async insert(member: TypeInsert<MemberInterface>, transaction: EntityManager) {
		return await this.queryInsert<MemberInterface>(MemberRecord, member, transaction)
	}

	// ============================= UPDATE =============================

	async update(member: TypeUpdate<MemberInterface>, transaction: EntityManager) {
		return await this.queryUpdate<MemberInterface>(MemberRecord, member, transaction)
	}

	// ============================= GETTER =============================

	async getMember<T extends MemberInterface & {
		borrows?: BorrowInterface[]
	}, GET extends GETTER>(
		{
			filter,
			option,
		}: {
			filter?: TypeFilter<Partial<MemberInterface>>,
			option: OPTION<GET> & {
				with_active_borrow?: boolean
			}
		}, transaction: EntityManager
	): Returned<T, GET> {
		return await this.querySelectNew(MemberRecord, 'member', (Q: SelectQueryBuilder<T>) => {
			if (option.with_active_borrow) {
				Q.leftJoinAndMapMany('member.borrows', BorrowRecord, 'borrow', `borrow.member_id = member.id AND borrow.status = '${BORROW_STATUS.BORROWED}'`)
			}
			return Q
		}, {
			...option,
			filter
		}, transaction)
	}

	// ============================= DELETE =============================

	// ============================ PRIVATES ============================
}

export default new MemberRepository()
