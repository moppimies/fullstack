const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

const helper = require('./test_helper')


beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
    await User.deleteMany({})
    
    const passwordHash = await bcrypt.hash('salasana',10)
    const user = new User({username: 'root',name:"Viljami",passwordHash})
    await user.save()
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

test('testing delete method',async() => {
    const startingBlogs = await helper.blogsInDb()
    
    const firstBlogId = startingBlogs[0].id

    await api.delete(`/api/blogs/${firstBlogId}`).expect(204)

    const endBlogs = await helper.blogsInDb()

    expect(endBlogs).toHaveLength(startingBlogs.length-1)

    const ids = endBlogs.map(x => x.id)
    expect(ids).not.toContain(firstBlogId)
})

test('testing put method to modify blogs', async() => {
    
    const blogs = await helper.blogsInDb()
    
    const firstBlogId = blogs[0].id
    const modifiedBlog = {
        title: "Muokattu blogi",
        id: blogs[0].id,
        author: "Muokkaaja",
        url: "localhost:3003/api/blogs",
        likes: 41

    }

    await api.put(`/api/blogs/${firstBlogId}`).send(modifiedBlog).expect(200)
    const modifiedBlogs = await helper.blogsInDb()
    expect(modifiedBlogs[0]).toEqual(modifiedBlog)
    
})

test('creation is succesful with new username', async()=> {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
        username: "admin",
        name: "Viljami",
        password: "123321"
    }

    await api.post('/api/users').send(newUser).expect(201).expect('Content-Type',/application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map (u => u.username)
    expect(usernames).toContain(newUser.username)
})

test('creation is not succesful' ,async() => {
    const usersAtStart = await helper.usersInDb()

    const newUserPassword= {
        username:"viljami",
        name: "Viljami",
        password:"12"
    }

    const newUserNotUnique = {
        username:"root",
        name: "Viljami",
        password:"123321"
    }

    const notDefinedUsername = {
        name:"Viljami",
        password:"123321"
    }

    const notDefinedPassword = {
        username:"uniqueUsername",
        name:"Viljami",
    }

    await api.post('/api/users').send(newUserPassword).expect(400).expect('Content-Type',/application\/json/)
    await api.post('/api/users').send(newUserNotUnique).expect(400).expect('Content-Type',/application\/json/)
    await api.post('/api/users').send(notDefinedUsername).expect(400).expect('Content-Type',/application\/json/)
    await api.post('/api/users').send(notDefinedPassword).expect(400).expect('Content-Type',/application\/json/)
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
})



afterAll(async () => {
    await mongoose.connection.close()
  })