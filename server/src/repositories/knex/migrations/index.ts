import { type IMigration } from '../../../services/knex'
import { create_table_user_000 } from './create_table_user_000'

export const migrations: IMigration[] = [create_table_user_000]
