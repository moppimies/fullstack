const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

morgan.token('body', (req, res) => JSON.stringify({name:req.body.name,number:req.body.number}))

let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456'
    },
    {
      id: 2,  
      name: "Ada Lovelace",
      number: "39-44-5323523"
    },
    {
      id: 3,
      name: "Dan Abramov",
      number: "12-43-234345"
    },
    {
      id: 4,
      name: "Mary Poppendieck",
      number: "39-23-6423122"
    }
]

app.get('/api/persons',(req,res) => {
    res.json(persons)
})

app.get('/info',(req,res) => {
    let personsCount = persons.length
    let date = new Date()
    res.send(`<p>Phonebook has info for ${personsCount} people</p><p>${date}</p>`)
    
})

app.get('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    }
    else {
        res.status(404).end()
    }

})

app.delete('/api/persons/:id',(req,res) => {
    const id = Number(req.params.id)
    let personCountStart = persons.length
    persons = persons.filter(person => person.id !== id)
    let personCountEnd = persons.length
    if (personCountEnd === personCountStart) {
        res.status(404).end()
        return
    }
    else {
        res.status(204).end()
    }
})

app.post('/api/persons',(req,res) => {
    const id = Math.floor(Math.random() * (1000-5) + 5)
    const person = req.body

    if (persons.find(h => h.name === person.name)) {
        res.status(400).send({error: 'name must be unique'}).end()
        return
    }
    if (persons.find(h => h.number === person.number)) {
        res.status(400).send({error: 'number must be unique'}).end()
        return
    }
    if (person.name === ""){
        res.status(400).send({error: 'name must be set'}).end()
        return
    }
    if (person.number === ""){
        res.status(400).send({error: 'number must be set'}).end()
        return
    }
    
    person.id = id
    persons = persons.concat(person)
    res.json(person)
})

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server runnin on port ${PORT}`)
})