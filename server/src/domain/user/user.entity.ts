type Literal = boolean | null | number | string
export type JSONValue = Literal | { [key: string]: JSONValue } | JSONValue[]

export interface User {
  id: number
  username: string
  latitude: number
  longitude: number
  location: JSONValue
  createdAt: number
  deletedAt: number
}

export type UserInput = Omit<User, 'id | createdAt | deletedAt | location'>
