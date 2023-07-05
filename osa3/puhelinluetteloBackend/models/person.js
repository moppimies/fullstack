const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
const url = process.env.MONGODB_URI
console.log("Connecting to ",url)

mongoose.connect(url)
.then(tulos => {
    console.log("great success")
})
.catch(tulos => {
    console.log("failure", tulos.message)
})



const personSchema = new mongoose.Schema( {
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    number: {
        type: String,
        validate:{
            validator: function(v) {
                return /^\d{3}-\d{8}$|^\d{2}-\d{7}$/.test(v)
                }
            ,
            message: 'Number format not accepted'
        },
        required: true
    }
})


personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)