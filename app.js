const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

logger.info('connecting to db')
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to db')
  })
  .catch(error => {
    logger.error('error connecting to server', error.message)
  })

app.use(cors())
app.use(express.json())

if (process.env.NODE_ENV !== 'test') {
  app.use(middleware.morganMiddleware)
}
app.use(middleware.extractToken)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app