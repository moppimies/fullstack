const http = require('http')
const express = require('express')


const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const blogRouter = require('./controllers/blogs') 


const middleware = require('./utils/middleware')

mongoose.set('strictQuery',false)
mongoose.connect(config.mongoUrl)

app.use(cors())
app.use(express.json())
app.use('/api/blogs',blogRouter)
app.use(express.static('build'))
app.use(middleware.errorHandler)
app.use(middleware.requestLogger)
app.use(middleware.unknownEndpoint)


module.exports = app