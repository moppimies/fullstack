import { useState, useEffect , useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Succesful from './components/Succesful'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [user,setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [message, setMessage] = useState(null)
  const blogFromRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a,b) => b.likes - a.likes))
    )
  }, [])

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedAppUser')
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('loggin in with',username, password)

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setPassword('')
      setUsername('')

    }catch(exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 2000)
    }
  }

  const addBlog = (blogObject) => {


    blogFromRef.current.toggleVisibility()
    blogService.create(blogObject)
      .then((returnedBlog) => {setBlogs(blogs.concat(returnedBlog))
        setMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
        setTimeout(() => {
          setMessage(null)
        }, 2000)
      })
      .catch((e) => {
        setErrorMessage('Could not create a new blog')
        setTimeout(() => {
          setErrorMessage(null)
        }, 2000)
      })

  }

  const errorOrSuccess = () => {
    if (errorMessage) {
      return (
        <Notification message={errorMessage} />
      )
    }else {
      return <Succesful message={message}/>
    }
  }

  const removePressed= (id) => {
    const blog = blogs.find(blog => blog.id === id)
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      blogService.remove(id).then(setBlogs(blogs.filter(blog => blog.id !== id)))
    }
  }
  const likePressed = id => {
    const blog = blogs.find(blog => blog.id === id)
    const newBlog = {
      user: blog.user,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
      id: id
    }

    blogService.update(id, newBlog)
      .then( returnedBlog =>
      {setBlogs(
        blogs.map(blogMap => blogMap.id !== id ? blogMap: returnedBlog))
      }).catch(error => {setErrorMessage(error.message)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })

  }
  const handleLogout = () => {
    window.localStorage.clear()
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={errorMessage} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange= {({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }


  return (
    <div>
      <h2>blogs</h2>
      {errorOrSuccess()}
      <div>
        <p>{user.name} logged in <button onClick={handleLogout}> logout</button></p>
      </div>
      <div>
        <Togglable buttonLabel="new blog" ref={blogFromRef}>
          <BlogForm
            createBlog={addBlog}
            user = {user}
          />
        </Togglable>
      </div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} user={user} likePressed={() => likePressed(blog.id)} removePressed={() => removePressed(blog.id)}/>
      )}

    </div>

  )
}

export default App