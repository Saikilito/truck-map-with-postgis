import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'

import { Routes } from './api/'

// Create Express server
const app = express()

// Express configuration
app.disable('x-powered-by')

app.use(cors())
app.use(helmet())
app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/user', Routes.userRoutes)

app.set('port', process.env.PORT ?? 8089)

export default app
