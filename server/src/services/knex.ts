import { type Knex, knex as client } from 'knex'
import { parseObjKeysToCamelCase } from '../utils'

type IDbCallback = (knex: Knex) => Promise<unknown | never>
type IObj = Record<string, string>

export interface IMigration extends Knex.Migration {
  name: string
}

const defaultMigration: IMigration = {
  name: 'default-migration',
  async up() {
    console.log('Default migration up')
  },
  async down() {
    console.log('Default migration down')
  }
}

class MigrationSource {
  constructor(private readonly migrations: IMigration[]) {}

  async getMigrations(): Promise<string[]> {
    return await Promise.resolve(this.migrations.map(({ name }) => name))
  }

  async getMigration(migrationName: string): Promise<IMigration> {
    return await Promise.resolve(this.migrations.find(({ name }) => name === migrationName) ?? defaultMigration)
  }

  getMigrationName(migrationName: string) {
    return migrationName
  }
}

export const knexMigrate = async (migrations: IMigration[]) => {
  const knex = client({
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING
  })
  try {
    const migrationSource = new MigrationSource(migrations)
    await knex.migrate.latest({
      migrationSource,
      disableTransactions: true
    })
  } catch (error) {
    console.error(error)
  } finally {
    await knex.destroy()
  }
}

export const db = async (callback: IDbCallback): Promise<unknown | never> => {
  const knex = client({
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING
  })

  try {
    const result = await callback(knex)

    if (Array.isArray(result)) {
      return result.map((value: IObj) => parseObjKeysToCamelCase(value))
    }

    return parseObjKeysToCamelCase(result as IObj)
  } catch (error) {
    console.error(error)
    throw error
  } finally {
    await knex.destroy()
  }
}
