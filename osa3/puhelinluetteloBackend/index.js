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
    next(error)
}

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use(express.static('build'))
morgan.token('body', (req, res) => JSON.stringify({name:req.body.name,number:req.body.number}))

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
    .then(result =>{
        res.status(204).end()
    })
    .catch(error => next(error))
    
})

app.post('/api/persons',(req,res) => {

    const person = req.body

    if (person.name === "" || !person.name){
        res.status(400).send({error: 'name must be set'}).end()
        return
    }
    if (person.number === "" || !person.number){
        res.status(400).send({error: 'number must be set'}).end()
        return
    }
    const lisattava = new Person( {
        name: req.body.name,
        number: req.body.number
    })

    lisattava.save().then(result => {
        console.log(`added ${result.name} ${result.number} to phonebook`)
        Person.find(result).then(person =>{ //return res.json(result)
            res.json(person)
        })
    })

})

app.put('/api/persons/:id',(req,res,next) => {
    const runko = req.body
    const person = {
        name: runko.name,
        number: runko.number,
    }
    
    Person.findByIdAndUpdate(req.params.id, person, {new: true})
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