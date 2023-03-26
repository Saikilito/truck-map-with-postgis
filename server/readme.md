# NODEJS-GIS

This is a backend for ingesting information about people with coordinates.

Before running this backend, please consider the following:

- Create a database.
- Add the connection string to environment variables.
- Ensure that you have the postgis extension for PostgreSQL installed as a dependency.
- Optionally, you can use the `docker-compose.yml` file in this repository to get PostgreSQL and PostGIS ready to go.

## Built With:

- Node.js v16.18
- PostGIS v3.3.2
- TypeScript v4.9
- Express.js
- ESLint

## CRUD for user:

- `GET User By Id: /api/user/:userId`
- `POST Create User: /api/user/:userId`

_Note:_ User input contains the following fields:

```js
{
  username(string), latitude(number), longitude(float)
}
```

- `DELETE User By Id: /api/user/:userId`
- `PATCH User By Id: /api/user/:userId`

_Note:_ User input contains the following fields:

```js
{
  username(string, optional),
    latitude(number, optional),
    longitude(float, optional),
    createdAt(date, optional),
    deletedAt(date, optional)
}
```

- `GET All Users: /api/user/all`

_Note:_ You can use query parameters for your search:

- `limit` to obtain a defined number of records.
- `km, latitude and longitude` use in group for to obtain records within a selected range.

## Recommended:

In this repository, you can find the `requests.http` file, which is useful with the REST Client for Visual Studio Code extension. This way, you have a collection of requests already set up to test this API. 👍
