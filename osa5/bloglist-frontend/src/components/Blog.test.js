import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'


test('blog renders title and author by default', () => {
  const blog = {
    user: 'root',
    likes: 20,
    author: 'Juho Matti',
    title: 'Juhon arkipäiväblogi',
    url: 'https://fullstackopen.com/osa5'
  }

  const { container } = render(<Blog blog={blog}/>)

  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent(
    'Juhon arkipäiväblogi'
  )
  expect(div).not.toHaveTextContent(
    'https://fullstackopen.com/osa5'
  )

})

test('blog url ,likes and user will show after button press', async() => {
  const blog = {
    user: {
      username:'root',
      name: 'Viljami'

    },
    likes: 20,
    author: 'Juho Matti',
    title: 'Juhon arkipäiväblogi',
    url: 'https://fullstackopen.com/osa5'
  }

  const userReal = {
    username:'root',
    name: 'Viljami'
  }


  const { container } = render(<Blog blog={blog} user={userReal}/>)
  const mockHandler = jest.fn()

  const user = userEvent.setup()

  const button = screen.getByText('view')
  await user.click(button)



  const div = container.querySelector('.fullBlog')
  console.log(div.innerHTML)
  expect(div).toHaveTextContent(
    'Juhon arkipäiväblogi'
  )
  expect(div).toHaveTextContent(
    'https://fullstackopen.com/osa5'
  )
  expect(div).toHaveTextContent(
    'Viljami' //pitää tehdä 5.8 ni toimiii
  )
  expect(div).toHaveTextContent(
    '20'
  )
})

test('like button clicked twice' ,async() => {
  const blog = {
    user: 'root',
    likes: 20,
    author: 'Juho Matti',
    title: 'Juhon arkipäiväblogi',
    url: 'https://fullstackopen.com/osa5'
  }
  const userReal = {
    username:'root',
    name: 'Viljami'
  }

  const user = userEvent.setup()
  const mockHandler = jest.fn()

  render(<Blog blog={blog} user={userReal} likePressed={mockHandler}/>)


  const button = screen.getByText('view')
  await user.click(button)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)


  expect(mockHandler.mock.calls).toHaveLength(2)

})

test ('blog created test' , async() => {
  const user = userEvent.setup()
  const mockHandler = jest.fn()

  render(<BlogForm createBlog={mockHandler}/>)



  const inputTitle = screen.getByPlaceholderText('title content')
  const inputAuthor = screen.getByPlaceholderText('author content')
  const inputUrl = screen.getByPlaceholderText('url content')
  const createButton = screen.getByText('create new blog', { exact: true })



  await user.type(inputTitle, 'Blogi autoista')
  await user.type(inputAuthor, 'Mark')
  await user.type(inputUrl, 'https://fullstackopen.com/osa5')

  await user.click(createButton)



  expect(mockHandler.mock.calls).toHaveLength(1)
  expect(mockHandler.mock.calls[0][0].title).toBe('Blogi autoista')
  expect(mockHandler.mock.calls[0][0].author).toBe('Mark')
  expect(mockHandler.mock.calls[0][0].url).toBe('https://fullstackopen.com/osa5')

})