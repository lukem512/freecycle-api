const express = require("express")
const bodyParser = require("body-parser")
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const routes = require("./routes/routes.js")(app)

app.use(function(req, res){
  res.status(404).send('Page not found')
});

const server = app.listen(process.env.PORT || 8080, function () {
  console.log("Listening on port %s...", server.address().port)
})
