const Succesful = ( { message }) => {
  if (message === null){
    return null
  }
  return (
    <div className ='success'>
      {message}
    </div>
  )

}
export default Succesful