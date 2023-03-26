import dotenv from 'dotenv'
import { Knex } from './services'
import { migrations } from './repositories/knex/migrations'
import app from './app'

/**
 * Start Express server.
 */
const server = app.listen(app.get('port'), () => {
  dotenv.config()
  Knex.knexMigrate(migrations)
    .then(() => {
      console.info('  App is running at http://localhost:%d 🚀🚀 in %s mode', app.get('port'), app.get('env'))
      console.info('  Press CTRL-C to stop\n')
    })
    .catch(console.error)
})

export default server
