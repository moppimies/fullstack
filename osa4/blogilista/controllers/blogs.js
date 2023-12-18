const Blog = require('../models/blog')
const User = require('../models/user')
const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const auth = request.get('authorization')
  if (auth && auth.startsWith('Bearer ')) {
    return auth.replace('Bearer ', '')
  }
  return null
}

blogRouter.get('/', async(request, response) => {
    const blogs = await Blog.find({}).populate('user' , {username:1, name:1 , id:1})
    response.json(blogs)
  })
  
blogRouter.post('/', async(request, response, next) => {
    const body = request.body
    
    decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    
    if (!decodedToken.id ) {
      return response.status(401).json({error: "token invalid"})
    }

    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id
    })
    try{
      const result = await blog.save()
      user.blogs = user.blogs.concat(result._id)
      const returned = await result.populate('user' , {username:1, name:1})
      await user.save()
      response.status(201).json(returned)

    }catch(exception) {
      next(exception)
    }
  })

  blogRouter.delete('/:id', async (request, response, next) => {
    
    await Blog.findByIdAndDelete(request.params.id)
    try {
      response.status(204).end()
    }catch(exception) {
      next(exception)
    }

  })

  blogRouter.put('/:id', async(request,response,next) => {
    const body = request.body
    console.log(body)
    const newBlog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: body.user.id
    }
    
    const result = await Blog.findByIdAndUpdate(request.params.id, newBlog, {new: true ,context: 'query'}).populate('user' , {username:1, name:1})

    try {
      response.json(result)
    } catch(exception) {
      next(exception)
    }
  })


  module.exports = blogRouter