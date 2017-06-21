const express = require('express')
const bcrypt = require('bcrypt')
const database = require('../database')
var router = express.Router()


router.get('/signup', (request, response) => {
  response.render('signup', {currentUser: request.cookies.user})
})

router.post('/signup', (request, response) => {
  let {username, email, password } = request.body
  password = bcrypt.hashSync( password, 12 )
  database.getUserByEmail( email , (error, user) => {
    if( user[0] ) {
      response.status(406).render('error', { error: new Error("Email already in use"), currentUser: request.cookies.user })
    } else {
      database.createUser( username, email, password, (error, users) => {
        user = users[0]
        delete user.password
        response.cookie( 'user',
          user ).
          redirect(`/users/${user.id}`)
      })
    }
  })
})

router.get('/login', (request, response) => {
  response.render('login', {currentUser: request.cookies.user})
})

router.post('/login', (request, response) => {
  let {email, password} = request.body

  database.getUserByEmail( email, ( error, users ) => {
    const user = users[0]
//This nesting is ugly and I hate it.  How can I refactor this?
    if( user ){
      if( bcrypt.compareSync( password, user.password)) {
        delete user.password
        response.cookie( 'user',
          user ).
          redirect(`/users/${user.id}`)
      } else {
        response.send('Incorrect username or password')
      }
    } else {
      response.send('Incorrect username or password')
    }
  })
})

router.get('/logout', (request, response) => {
  response.clearCookie('user').redirect('/')
})

module.exports = router