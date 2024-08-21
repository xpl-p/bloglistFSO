const totalLikes = (blogs) => {
  return blogs.reduce((acc, cur) => {
    return acc + cur.likes
  },0)
}

const mostLikes = (blogs) => {
  return blogs.reduce((max, cur) => {
    return max.likes > cur.likes ? max : cur
  },0)
}

module.exports = {
  totalLikes,
  mostLikes
}