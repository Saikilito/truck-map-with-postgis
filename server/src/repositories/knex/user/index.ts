import { type User, type UserRepository, type ISeachByKm } from '../../../domain/user'
import { Knex } from '../../../services'

interface GetRow {
  rows: any[]
}

const client = Knex.db
export const makeUserRepo = (): UserRepository => ({
  create: async (input) => {
    const { username, latitude, longitude } = input
    const WGS84 = 4326
    await client((knex) =>
      knex.schema.raw(
        `INSERT INTO users (username, latitude, longitude, location, created_at, deleted_at) VALUES  ('${username}', '${latitude}', '${longitude}', ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), ${WGS84}), current_timestamp, current_timestamp)`
      )
    )
  },

  getMany: async (limit, searchByKm: ISeachByKm | null = null) => {
    if (searchByKm) {
      const { km, latitude, longitude } = searchByKm
      console.info('Query KM conseguido', { searchByKm })
      const query = `
        SELECT *, 
            (ROUND(earth_distance(ll_to_earth(${latitude}, ${longitude}), ll_to_earth(latitude, longitude))::NUMERIC, 2)) AS distance
        FROM
          users
        WHERE
          earth_box(ll_to_earth (${latitude}, ${longitude}), ${km}) @> ll_to_earth (latitude, longitude)
        AND earth_distance(ll_to_earth (${latitude}, ${longitude}), ll_to_earth (latitude, longitude)) < ${km}
        ORDER BY
          distance;`

      const rawUsers = (await client((knex) => knex.schema.raw(query))) as GetRow
      const users = rawUsers.rows
      console.info({ users })
      return users
    }

    const rawUsers = (await client((knex) =>
      knex.schema.raw(`select *, ST_AsText(location) as location_as_text from users ${limit ? `limit ${limit}` : ''}`)
    )) as GetRow

    const users = rawUsers.rows

    return users as User[]
  },

  getById: async (id) => {
    const rawUser = (await client((knex) =>
      knex.schema.raw(`select *, ST_AsText(location) as location_as_text from users where id=${id}`)
    )) as GetRow

    const [user] = rawUser.rows

    return user as User
  },

  deleteById: async (id) => {
    await client((knex) => knex.schema.raw(`delete from users where id=${id}`))
  },

  update: async (id, data) => {
    const keys = Object.keys(data)
    const values = Object.values(data).map((val) => `'${val}'`)

    const setQuery = keys.reduce((acc, key, index) => {
      return acc + `${key}=${values[index]}${index === keys.length - 1 ? '' : ','}`
    }, '')

    await client((knex) => knex.schema.raw(`update users set ${setQuery} where id=${id}`))
  }
})
