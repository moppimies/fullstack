import { useState, useEffect } from 'react'
import personService from './services/persons'


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
          number: newNumber
        }
        personService.muutaHenkilo(henkilo.id, muokattu).then(person => setPersons(persons.map(henkilo => henkilo.id === person.id ? muokattu : henkilo)))
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

    personService.createPerson(ihminen).then(uusi => setPersons(persons.concat(uusi)))
  }

  const poista =(id)=> {
    personService.poistaHenkilo(id).then(vastaus => console.log(vastaus.id)).catch(error => console.log(error))
    setPersons(persons.filter((person) => person.id !== id))
  }

  return (
    <div>
      <h2>Phonebook</h2>
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