const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { extractUser } = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    return response.json(blog)
  } else {
    response.status(400).end()
  }
})


blogsRouter.post('/', extractUser, async (request, response) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: user.name,
    url: body.url,
    likes: body.likes,
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body
  const updatedEntry = await Blog.findByIdAndUpdate(request.params.id, { likes }, { new: true, runValidators: true })
  response.status(200).json(updatedEntry)
})

blogsRouter.delete('/:id', extractUser, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(400).json({ error: 'no blog' })
  }
  if (blog.user.toString() !== request.user.id) {
    return response.status(401).json({ error: 'cannot delete unowned blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter