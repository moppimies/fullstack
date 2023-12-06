const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: "Blogi kaloista",
        author: "Viljami",
        url: "localhost:3003/api/blogs",
        likes: 100
    },
    {
        title: "Full Stack",
        author: "Tekijä",
        url: "localhost:3003/api/blogs",
        likes: 50
    }
]


const nonExistingId = async() => {
    const blog = new Blog({content:'willremovethissoon'})
    await blog.save()
    await blog.remove()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    
    return blogs.map (blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}


module.exports = {
    initialBlogs, nonExistingId, blogsInDb, usersInDb
}