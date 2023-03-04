import RepositoryModel, { GETTER, OPTION, Returned, TypeFilter } from 'sub_modules/utils/libs/typeorm'
import { EntityManager, SelectQueryBuilder } from 'typeorm'
import BookRecord, { BookInterface } from 'entities/records/book'
import { TypeInsert } from 'entities/types'


class BookRepository extends RepositoryModel {

	static __displayName = 'BookRepository'

	// ============================= INSERT =============================

	async upserts(books: TypeInsert<BookInterface>[], transaction: EntityManager) {
		return await this.queryInsertOrUpdate<BookInterface[]>(BookRecord, books, ['id'], transaction)
	}

	// ============================= UPDATE =============================

	// ============================= GETTER =============================

	async getBook<T extends BookInterface, GET extends GETTER>(
		{
			filter,
			option,
		}: {
			filter?: TypeFilter<Partial<Omit<BookInterface, 'id'> & {
				id: number[] | number
			}>>,
			option: OPTION<GET>
		}, transaction: EntityManager
	): Returned<T, GET> {
		return await this.querySelectNew(BookRecord, 'book', (Q: SelectQueryBuilder<T>) => {
			return Q
		}, {
			...option,
			filter
		}, transaction)
	}

	// ============================= DELETE =============================

	// ============================ PRIVATES ============================
}

export default new BookRepository()
