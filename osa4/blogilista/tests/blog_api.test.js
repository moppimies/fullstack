const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)

})


test('Blogs are returned as JSON', async () => {
    await api
    .get("/api/blogs")
    .expect(200)
    .expect('Content-Type', /application\/json/)
    
    
})

test('Blogs length match', async() => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('Ids match', async() => {
    const response = await helper.blogsInDb()
    for (let i = 0; i < response.length;i++) {
        expect(response[i].id).toBeDefined()
    }
    
})

test('http post blogs', async() => {
    const newBlog = {
        title: "Tämä blogi ei kerro kaloista",
        author: "Juho",
        url: "localhost:3003/api/blogs",
        likes: 1
    }

    await api.post('/api/blogs').send(newBlog).expect(201).expect('Content-Type', /application\/json/)
    const blogsInDb = await helper.blogsInDb()
    expect(blogsInDb).toHaveLength(helper.initialBlogs.length + 1)
})

test('likes not set' ,async() => {
    const newBlog = {
        title: "likejä ei ole",
        author: "Matti",
        url: "www.google.com"
    }

    await api.post('/api/blogs').send(newBlog).expect(201)
    const blogsInDb = await helper.blogsInDb()
    const lisatty = blogsInDb[helper.initialBlogs.length]
    
    expect(lisatty.likes).toBeDefined()
    expect(lisatty.likes).toBe(0)
})

test('url or title not set', async() => {
    
    const blogNoUrl = {
        title: "Ei urlia",
        author: "Matti",
        likes:1
    }

    const blogNoTitle = {
        author: "Matti",
        url: "www.google.com",
        likes: 2
    }

    await api.post('/api/blogs').send(blogNoUrl).expect(400)
    await api.post('/api/blogs').send(blogNoTitle).expect(400)
})

afterAll(async () => {
    await mongoose.connection.close()
  })