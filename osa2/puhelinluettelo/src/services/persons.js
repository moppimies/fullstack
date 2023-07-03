import axios from 'axios'
const baseUrl = '/api/persons' 

const getAll = () => {
    const pyynto =  axios.get(baseUrl)
    return pyynto.then(response => response.data)
}

const createPerson = henkilo => {
    const pyynto = axios.post(baseUrl,henkilo)
    return pyynto.then(response => response.data)
}

const poistaHenkilo = id => {
    const pyynto = axios.delete(`${baseUrl}/${id}`)
    return pyynto.then((response) => response.data)
}

const muutaHenkilo =(id, henkilo) => {
    const pyynto = axios.put(`${baseUrl}/${id}`,henkilo)
    return pyynto.then(response => response.data)
}

export default {getAll, createPerson, poistaHenkilo, muutaHenkilo}