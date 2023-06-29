const Header=(props) => {
   
    return (
      <div>
        <h2>{props.course}</h2>
      </div>
    )
  }
  
  const Part = (props) => {
  
    return (
      <div>
        <p>{props.part} {props.exercises}</p>
      </div>
    )
  }
  
  const Content=(props) => {
      const parts = props.parts
      return (
        <div>
          {parts.map((part) => <Part key = {part.id} part={part.name} exercises={part.exercises}></Part>)}
        </div>
      )
  }
  
  const Total=(props) => {
    const parts = props.parts
    const summa = parts.reduce((s,part) => {
      return (s + part.exercises)
    }, 0);

    return (
      <div>
        <strong>Number of exercises {summa}</strong>
      </div>
    )
  }
  
  const Course=(props) => {
    const course = props.course
    return (
      <div>
        <Header course = {course.name}></Header>
        <Content parts = {course.parts}></Content>
        <Total parts={course.parts}></Total>
      </div>
    )
  }

  export default Course