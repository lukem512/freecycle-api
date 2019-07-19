const freecycle = require('freecycle')

const getPosts = ({ group, type = freecycle.TYPE.offer }, res) => {
  if (!group || group === '') {
    return res.status(400).send('Invalid group specified')
  }
  if (type) {
    if (!freecycle.TYPE[type]) {
      return res.status(400).send('Invalid type specified')
    }
  }
  freecycle.getPosts(group, (err, posts) => {
    if (err) {
      console.error(err)
      return res.status(500).send('Unable to retrieve posts')
    }
    return res.send(posts)
  }, type)
}

const appRouter = app => {
  app.get('/', (req, res) => {
    res.send(`
      <h1>Freecycle API</h1>
      <p>The following RESTful endpoints are available:</p>
      <ul>
        <li>/posts/:group</li>
        <li>/posts/:group/:type</li>
        <li>/post/:group/:id</li>
      </ul>
      <p>where :group, :type and :id are variables determining the group name, post type ("offer", "wanted" or "all") and post id.</p>
      `)
  })

  app.get('/posts/:group', (req, res) => getPosts(req.params, res))
  app.get('/posts/:group/:type', (req, res) => getPosts(req.params, res))

  app.get('/post/:group/:id', (req, res) => {
    const { id, group } = req.params
    if (!group || group === '') {
      res.status(400).send('Invalid group specified')
    }
    if (!id || id === '') {
      res.status(400).send('Invalid post specified')
    }
    freecycle.getPostById(group, id, (err, post) => {
      if (err) {
        console.error(err)
        res.status(500).send('Unable to retrieve post')
      }
      res.send(post)
    })
  })
}

module.exports = appRouter
