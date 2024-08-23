const morgan = require('morgan')
const logger = require('./logger')

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})
const morganMiddleware = morgan(':method :url :status :res[content-l] - :response-time ms :body')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  }

  next(error)
}

module.exports = {
  morganMiddleware,
  unknownEndpoint,
  errorHandler,
}