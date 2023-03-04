import RepositoryModel, { GETTER, OPTION, Returned, TypeFilter } from 'sub_modules/utils/libs/typeorm'
import { EntityManager, SelectQueryBuilder } from 'typeorm'
import { TypeInsert, TypeUpdate } from 'entities/types'
import BorrowRecord, { BorrowInterface, BORROW_STATUS } from 'entities/records/borrow'


class BorrowRepository extends RepositoryModel {

	static __displayName = 'BorrowRepository'

	// ============================= INSERT =============================

	async inserts(borrows: TypeInsert<BorrowInterface>[], transaction: EntityManager) {
		return await this.queryInsert<BorrowInterface[]>(BorrowRecord, borrows, transaction)
	}

	// ============================= UPDATE =============================

	async upserts(borrows: TypeInsert<BorrowInterface>[], transaction: EntityManager) {
		return await this.queryInsertOrUpdate<BorrowInterface[]>(BorrowRecord, borrows, ['id'], transaction)
	}

	async update(borrow: TypeUpdate<BorrowInterface>, transaction: EntityManager) {
		return await this.queryUpdate<BorrowInterface>(BorrowRecord, borrow, transaction)
	}

	// ============================= GETTER =============================

	async getBorrow<T extends BorrowInterface, GET extends GETTER>(
		{
			filter,
			option,
		}: {
			filter?: TypeFilter<Partial<Omit<BorrowInterface, 'book_id' | 'status'> & {
				book_id: number | number[]
				status: BORROW_STATUS | BORROW_STATUS[]
			}>>,
			option: OPTION<GET> & {
				is_penalized?: boolean
			}
		}, transaction: EntityManager
	): Returned<T, GET> {
		return await this.querySelectNew(BorrowRecord, 'borrow', (Q: SelectQueryBuilder<T>) => {
			if (option.is_penalized) {
				Q.andWhere(`NOW() - borrow.penalized_at <= '3 days'`)
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

export default new BorrowRepository()
