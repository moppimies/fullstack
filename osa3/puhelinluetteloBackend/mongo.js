const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('password required')
  process.exit(1)
}

const password=process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.sdzhwgf.mongodb.net/persons?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema( {
  name: String,
  number: String,
})

const Person = mongoose.model('Person',personSchema)

if (process.argv.length > 3) {
  const lisattava = new Person( {
    name: process.argv[3],
    number: process.argv[4]
  })

  lisattava.save().then(result => {
    console.log(`added ${result.name} ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}

if (process.argv.length === 3) {
  Person.find({}).then(persons => {
    persons.forEach(alkio => {
      console.log(alkio)
      mongoose.connection.close()
    })
  })
}
