import { useState, useEffect } from 'react'
import personService from './services/persons'
import './index.css'

const Ilmoitus = ({message,onnistuiko}) => {
  if (message === null) {
    return null 
  }
  switch(onnistuiko) {
    case false:
      return (
          <div className='error'>
            {message}
          </div>
        )
    case true:
      return (
        <div className='onnistui'>
          {message}
        </div>
      )
    default:
      console.log("hölömö")
  }
}

const Filter = (props) => {
  return (
    <div>
      filter shown with:<input value={props.filter} onChange = {props.funktio}/>
    </div>
    
  )
}

const Persons = (props) => {
  const persons = props.persons
  const newFilter = props.filter

  return ( 
    <div >
      {persons.filter((henkilo) =>
       henkilo.name.toLowerCase().includes(newFilter.toLowerCase()))
       .map((person)=>
       <p key={person.name}>{person.name} {person.number} <button onClick={(e) => props.poista(person.id)}>delete</button> </p>)}
    </div >
  )
}

const PersonForm = (props) => {

  return (
  <form onSubmit={props.lisaaNimiFunktio}>
    <div>
      name: <input value={props.nimi} onChange={props.funktioNimi}/>
    </div>
    <div>
      number: <input value={props.numero} onChange={props.funktioNumero}/>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [onnistuiko, setOnnistuiko] = useState(true)


  useEffect(() => {
    personService
    .getAll()
    .then(persons => setPersons(persons))
    }
  ,[])

  const lisaaNimi = (event) => {
    event.preventDefault()
    let henkilo = {}
    if (henkilo = persons.find(olio => olio.name === newName )) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with new one?`)) {
        
        const muokattu = {
          name: henkilo.name,
          number: newNumber,
          id: henkilo.id
        }
        personService.muutaHenkilo(henkilo.id, muokattu).then(person => {
          setPersons(persons.map(henkilo => henkilo.id === person.id ? muokattu : henkilo))},
          setErrorMessage(`${henkilo.name} number has changed to ${newNumber}`),
          setOnnistuiko(true),
          setTimeout(() => {
            setErrorMessage(null)
          },5000)
        )
        .catch(error => {
          setErrorMessage(`${error.response.data.error}`)
          setOnnistuiko(false)
        setTimeout(() => {
          setErrorMessage(null)
        },5000)
        //setPersons(persons.filter(h => h.id !== henkilo.id))
        //setOnnistuiko(false)
      })
        return
      }

      else {
        return
      }
      
    }
    
    const ihminen = {
      name: newName,
      number: newNumber
    }

    personService.createPerson(ihminen).then(uusi => {
      setPersons(persons.concat(uusi))},
      setOnnistuiko(true),
      setErrorMessage(`${newName} was added to phonebook`),
      setTimeout(() => {
        setErrorMessage(null)
      },5000))
      .catch(error => {
        setOnnistuiko(false)
        setErrorMessage(`${error.response.data.error}`)
        console.log(error.response.data)
        setTimeout(() => {
          setErrorMessage(null)
        },5000)
      })
  }

  const poista =(id)=> {

    personService.poistaHenkilo(id).then(() => {
      setOnnistuiko(true)},
      setErrorMessage(`'${(persons.find(henkilo => henkilo.id === id)).name}' was deleted`), 
      setPersons(persons.filter(person => person.id !== id)),
      setTimeout(() => {
        setErrorMessage(null)
      },5000))
      .catch(error => {
      setOnnistuiko(false)
      setErrorMessage(`Person was already removed from server`)
    setTimeout(() => {
      setErrorMessage(null)
    },5000)
    setPersons(persons.filter(h => h.id !== id))
  })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Ilmoitus message ={errorMessage} onnistuiko={onnistuiko}></Ilmoitus>
      <div>
        <Filter funktio= {e => setFilter(e.target.value)} filter ={newFilter}></Filter>
      </div>
      <h3>add a new</h3>
        <PersonForm 
        nimi={newName}
        numero={newNumber}
        funktioNumero={e => setNewNumber(e.target.value)}
        funktioNimi = {e => setNewName(e.target.value)}
        lisaaNimiFunktio={lisaaNimi}
         ></PersonForm>
      <h2>Numbers</h2>
        <Persons persons = {persons} filter = {newFilter} poista={poista}></Persons>
    </div>
  )

}

export default App