/* eslint-disable @typescript-eslint/naming-convention */
import { type Knex } from 'knex'

export const create_table_user_000 = {
  name: 'create_table_user_000',
  async up(knex: Knex) {
    try {
      await knex.schema.raw('CREATE EXTENSION postgis')
    } catch (error) {
      console.info('postgis alredy!')
    }

    try {
      await knex.schema.raw('CREATE EXTENSION cube')
    } catch (error) {
      console.info('cube alredy!')
    }

    try {
      await knex.schema.raw('CREATE EXTENSION earthdistance')
    } catch (error) {
      console.info('earthdistance alredy!')
    }

    const exist = await knex.schema.hasTable('users')
    if (exist) {
      return
    }

    await knex.schema.createTable('users', (table) => {
      table.bigIncrements('id').unsigned().primary()

      table.string('username', 512).notNullable()
      table.float('latitude').notNullable()
      table.float('longitude').notNullable()
      table.geometry('location').notNullable()

      table.datetime('created_at').defaultTo(knex.fn.now()).notNullable()
      table.datetime('deleted_at').defaultTo(null)
    })

    await knex.schema.raw(
      'CREATE INDEX location_idx ON users USING gist (ll_to_earth(latitude::float, longitude::float));'
    )
  },
  async down(knex: Knex) {
    await knex.raw('DROP TABLE users')
    await knex.schema.raw('DROP INDEX location_idx;')
  }
}
