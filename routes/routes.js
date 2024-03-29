const freecycle = require('freecycle')

const USAGE = `
  <h1>Freecycle API</h1>
  <p>The following RESTful endpoints are available:</p>
  <ul>
    <li>/posts/:group</li>
    <li>/posts/:group/:results</li>
    <li>/posts/:group/:results/:type</li>
    <li>/post/:group/:id</li>
  </ul>
  <p>where :group, :results, :type and :id are variables determining the group name, number of post results (>= 10), post type ("offer", "wanted" or "all") and post id.</p>
  `

const getPosts = ({ group, resultsPerPage, type = freecycle.TYPE.offer }, res) => {
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
  }, { group, resultsPerPage, type})
}

const appRouter = app => {
  app.get('/', (req, res) => {
    res.send(USAGE)
  })

  app.get('/posts/:group', (req, res) => getPosts(req.params, res))
  app.get('/posts/:group/:resultsPerPage', (req, res) => getPosts(req.params, res))
  app.get('/posts/:group/:resultsPerPage/:type', (req, res) => getPosts(req.params, res))

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
