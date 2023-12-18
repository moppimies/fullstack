import { useState } from 'react'




const BlogForm = ({ createBlog }) => {

  const [newUrl, setUrl] = useState('')
  const [newAuthor, setAuthor] = useState('')
  const [newTitle, setTitle] = useState('')

  const addBlog = (event) => {
    event.preventDefault()

    createBlog(({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: 0,
    }))

    setAuthor('')
    setTitle('')
    setUrl('')
  }

  return (
    <div className='blogFormDiv'>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
              title:
          <input
            type="text"
            value={newTitle}
            name="Title"
            onChange={event => setTitle(event.target.value)}
            placeholder='title content'
          />
        </div>
        <div>
              author:
          <input
            type="text"
            value={newAuthor}
            name="Author"
            onChange={event => setAuthor(event.target.value)}
            placeholder='author content'
          />
        </div>
        <div>
              url:
          <input
            type="text"
            value={newUrl}
            name="Url"
            onChange={event => setUrl(event.target.value)}
            placeholder='url content'
          />
        </div>
        <button type="submit">create new blog</button>
      </form>
    </div>
  )
}

export default BlogForm