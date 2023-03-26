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
      knex.raw(
        `INSERT INTO users (username, latitude, longitude, location, created_at, deleted_at) VALUES  (?, ?, ?, ST_SetSRID(ST_MakePoint(?, ?), ${WGS84}), current_timestamp, current_timestamp)`,
        [username, latitude, longitude, longitude, latitude]
      )
    )
  },

  getMany: async (limit, searchByKm?: ISeachByKm) => {
    if (searchByKm) {
      const { km, latitude, longitude } = searchByKm

      let query = `
          SELECT
            id, username, latitude , longitude ,
            (ROUND(earth_distance(ll_to_earth(?, ?), ll_to_earth(latitude, longitude))::NUMERIC, 2) / 1000) AS distance_in_km
          FROM
            users
      `
      if (km) {
        query += `
            WHERE
              earth_box(ll_to_earth(?, ?), ? * 1000) @> ll_to_earth(latitude, longitude)
            AND
              earth_distance(ll_to_earth(?, ?), ll_to_earth(latitude, longitude)) <= ? * 1000.0
      `
      }
      query += `ORDER BY distance_in_km`

      const rawUsers = (await client((knex) =>
        knex.raw(query, [latitude, longitude, latitude, longitude, km, latitude, longitude, km])
      )) as GetRow
      const users = rawUsers.rows
      return users
    }

    const limitQuery = limit ? 'limit ?' : ''
    const query = `select *, ST_AsText(location) as location_as_text from users ${limitQuery}`

    const rawUsers = (await client((knex) => (limit ? knex.raw(query, [limit]) : knex.schema.raw(query)))) as GetRow

    const users = rawUsers.rows

    return users as User[]
  },

  getById: async (id) => {
    const rawUser = (await client((knex) =>
      knex.raw(`select *, ST_AsText(location) as location_as_text from users where id=?`, [id])
    )) as GetRow

    const [user] = rawUser.rows

    return user as User
  },

  deleteById: async (id) => {
    await client((knex) => knex.raw(`delete from users where id=?`, [id]))
  },

  update: async (id, data) => {
    const keys = Object.keys(data)
    const values = Object.values(data)

    const setQuery = keys.reduce((acc, key, index) => {
      return acc + `${key}=?${index === keys.length - 1 ? '' : ','}`
    }, '')

    const query = `update users set ${setQuery} where id=?`

    await client((knex) => knex.raw(query, [...values, id]))
  }
})
