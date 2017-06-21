const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const database = require('./database')
const app = express()

const index = require('./routes/index')
const auth = require('./routes/auth')
const review = require('./routes/review')

require('ejs')
app.set('view engine', 'ejs');

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/', index)
app.use('/auth', auth)
app.use('/review', review)

app.use((request, response) => {
  response.status(404).render('not_found', {currentUser: request.cookies.user})
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`)
})

