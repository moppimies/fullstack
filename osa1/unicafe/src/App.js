import { useState } from 'react'

const Button = (props) => {
  return (
      <button onClick = {props.handleClick}>{props.text}</button>
  )
}

const StatisticLine = (props) => {
  return ( 
    <tbody><tr><td>{props.text}</td><td>{props.value}</td></tr></tbody>
  )
}

const Statistics = (props) => {
  const good = props.taulukko[0]
  const neutral = props.taulukko[1]
  const bad = props.taulukko[2]
  if ((good + neutral+ bad) == 0) {
    return (
      <div>
        <h2>
          statistics
        </h2>
        No feedback given
      </div>
    )
  }
  return(
    <div>
      <h2>
        statistics
      </h2>
      <table>
        <StatisticLine text ={"good"} value ={good}></StatisticLine>
        <StatisticLine text ={"neutral"} value ={neutral}></StatisticLine>
        <StatisticLine text ={"bad"} value ={bad}></StatisticLine>

        <StatisticLine text = {"all"} value = {good+neutral+bad}></StatisticLine>
        <StatisticLine text ={"average"} value = {(good*1+bad*(-1)) / (good +neutral + bad)}></StatisticLine>
        <StatisticLine text = {"positive"} value ={(props.taulukko[0] /(props.taulukko[0] +props.taulukko[1] + props.taulukko[2]))*100 +"%"} ></StatisticLine>
      </table>    
    </div>
      
     
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const goodClick = () => {
    setGood(good + 1)
  }
  const neutralClick = () => setNeutral(neutral +1)
  const badClick = () => setBad(bad +1)

  return (
    <div>
      <h2>give feedback</h2>
      <Button handleClick ={goodClick} text={"good"}></Button>
      <Button handleClick ={neutralClick} text={"neutral"}></Button>
      <Button handleClick ={badClick} text={"bad"}></Button>
      <Statistics taulukko ={[good,neutral,bad]}></Statistics>
    </div>
  )
}

export default App