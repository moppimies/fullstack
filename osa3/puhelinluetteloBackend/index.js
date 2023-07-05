require('dotenv').config()

const express = require('express')
const app = express()
const Person = require('./models/person')
const cors = require('cors')
const morgan = require('morgan')

const errorHandler = (error,req,res,next) => {
  console.error(error.message)
  if (error.name ==='CastError') {
    return res.status(400).send({error: 'malformatted id'})
  }
  else if (error.name === 'ValidationError') {
    return res.status(400).json({error: error.message})
  }
  next(error)
}

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('build'))
morgan.token('body', (req) => JSON.stringify({name:req.body.name,number:req.body.number}))

app.get('/api/persons',(req,res) => {
  Person.find({}).then(persons =>{
    res.json(persons)
  })
    
})

app.get('/info',(req,res) => {
  let date = new Date()
  Person.find({}).then(persons =>{
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
  })
})

app.get('/api/persons/:id', (req,res,next) => {
  Person.findById(req.params.id)
    .then(person =>{
      if (person) {
        res.json(person)
      }
      else{
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id',(req,res,next) => {
    
  Person.findByIdAndRemove(req.params.id)
    .then(() =>{
      res.status(204).end()
    })
    .catch(error => next(error))
    
})

app.post('/api/persons',(req,res,next) => {

  const lisattava = new Person( {
    name: req.body.name,
    number: req.body.number
  })

  lisattava.save().then(result => {
    res.json(result)
  })
    .catch(error => next(error))
})


app.put('/api/persons/:id',(req,res,next) => {
  const {name, number} = req.body
    
  Person.findByIdAndUpdate(req.params.id, {name,number}, {new: true, runValidators: true, context: 'query'})
    .then(personFix => {
      res.json(personFix)
    })
    .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT||3001
 
app.listen(PORT, () => {
  console.log(`Server runnin on port ${PORT}`)
})