const express = require('express')
const app = express()
const exphbs = require('express-handlebars')


const routes = require('./routes')

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

const PORT = 3000

require('./config/mongoose')

app.use(routes)

app.listen(PORT, () => {
  console.log(`App is starting on http://localhost:${PORT}`)
})