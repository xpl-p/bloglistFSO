const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogController')
const logger = require('./utils/logger')
const config = require('./utils/config')
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
app.use(middleware.morganMiddleware)

app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app