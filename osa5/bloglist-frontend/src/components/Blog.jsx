import { useState,useEffect } from 'react'
import blogService from '../services/blogs'




const ShowButton = (props) => {


  if (props.user.username === props.blog.user.username ) {
    return (
      <div>
        <button onClick={props.removePressed}>remove</button>
      </div>
    )
  }else {
    return null
  }
}


const Blog = ({ blog, user, likePressed , removePressed }) => {

  const [showFull, setShowFull] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  if (!showFull) {
    return (
      <div style = {blogStyle} className='blog'>
        {blog.title} {blog.author}
        <button onClick={ () => setShowFull(!showFull)}>view</button>
      </div>
    )} else {
    return (
      <div style = {blogStyle} className='fullBlog'>
        <div>
          {blog.title} {blog.author}
          <button onClick={() => setShowFull(!showFull)}>hide</button>
        </div>
        <div>
          {blog.url}
        </div>
        <div>
          {blog.likes}
          <button type ="button" onClick={likePressed}>like</button>
        </div>
        <div>
          {blog.user.name}

        </div>
        <ShowButton user = {user} blog = {blog} removePressed={removePressed}/>
      </div>
    )}

}

export default Blog