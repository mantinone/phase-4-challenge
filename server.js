const express = require('express')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const database = require('./database')
const moment = require('moment')
const app = express()

require('ejs')
app.set('view engine', 'ejs');

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.get('/', (request, response) => {
  const cookies = request.cookies
  if (cookies.user ){
    database.getAlbums((error, albums) => {
      if (error) {
        response.status(500).render('error', { error: error, currentUser: request.cookies.user })
      } else {
        response.render('index', { albums: albums, currentUser: cookies.user })
      }
    })
  } else {
    response.render('splash', {currentUser: request.cookies.user})
  }

})

//TODO: Separate these into their own files.
app.get('/signup', (request, response) => {
  response.render('signup', {currentUser: request.cookies.user})
})

app.post('/signup', (request, response) => {
  let {username, email, password } = request.body
  password = bcrypt.hashSync( password, 12 )

  database.createUser( username, email, password, (error, users) => {
    user = users[0]
    delete user.password
    response.cookie( 'user',
      user ).
      redirect(`users/${user.id}`)
  })
})

app.get('/login', (request, response) => {
  response.render('login', {currentUser: request.cookies.user})
})

app.post('/login', (request, response) => {
  let {email, password} = request.body

  database.getUserByEmail( email, ( error, users ) => {
    const user = users[0]
//This nexting is ugly and I hate it.  How can I refactor this?
    if( user ){
      if( bcrypt.compareSync( password, user.password)) {
        delete user.password
        response.cookie( 'user',
          user ).
          redirect(`users/${user.id}`)
      } else {
        response.send('Incorrect username or password')
      }
    } else {
      response.send('Incorrect username or password')
    }
  })
})

app.get('/logout', (request, response) => {
  response.clearCookie('user').redirect('/')
})

app.get('/users/:userId', (request, response) => {
  const {userId} = request.params

  database.getUserById( userId, (error, users) => {
    const user = users[0]
    user.joined = moment( user.created ).format(' dddd, MMMM Do, YYYY')
    response.render('profile', {user, currentUser: request.cookies.user})
  })
})

app.get('/cookieTest', (request, response) => {
  if (!request.cookies ){
    request.cookies.counter = 1
  } else {
    request.cookies.counter++
  }
  response.cookie( 'counter', request.cookies.counter ).redirect('/')
})

//TODO: Separate into own route files
app.get('/albums/:albumID', (request, response) => {
  const albumID = request.params.albumID

  database.getAlbumsByID(albumID, (error, albums) => {
    if (error) {
      response.status(500).render('error', { error: error, currentUser: request.cookies.user })
    } else {
      const album = albums[0]
      response.render('album', { album: album, currentUser: request.cookies.user })
    }
  })
})

app.use((request, response) => {
  response.status(404).render('not_found', {currentUser: request.cookies.user})
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`)
})


