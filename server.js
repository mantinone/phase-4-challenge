const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const database = require('./database')
const moment = require('moment')
const app = express()

const auth = require('./routes/auth')

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
        const theAlbums = albums
        database.getRecentReviews( 3, ( error, reviews) => {
          if (error) {
            response.status(500).render('error', { error: error, currentUser: request.cookies.user })
          } else {
            reviews = formatDates(reviews)
            response.render('index', { albums: albums, reviews: reviews, currentUser: cookies.user })
          }
        })
      }
    })
  } else {
    response.render('splash', {currentUser: request.cookies.user})
  }

})

//TODO: Separate these into their own files.
app.use('/auth', auth)

app.get('/users/:userID', (request, response) => {
  const {userID} = request.params
  database.getUserByID( userID, (error, users) => {
    const user = users[0]
    user.joined = moment( user.created ).format(' dddd, MMMM Do, YYYY')
    database.getReviewsByUser( userID, ( error, reviews) => {
      if (error) {
        response.status(500).render('error', { error: error, currentUser: request.cookies.user })
      } else {
        reviews = formatDates(reviews)
        response.render('profile', { user: user, reviews: reviews, currentUser: request.cookies.user })
      }
    })
  })
})

//TODO: Separate into own route files
app.get('/albums/:albumID', (request, response) => {
  const albumID = request.params.albumID

  database.getAlbumsByID(albumID, (error, albums) => {
    if (error) {
      response.status(500).render('error', { error: error, currentUser: request.cookies.user })
    } else {
      const album = albums[0]
      database.getReviewsByAlbum( albumID, ( error, reviews) => {
        if (error) {
          response.status(500).render('error', { error: error, currentUser: request.cookies.user })
        } else {
          reviews = formatDates(reviews)
          response.render('album', { album: album, reviews: reviews, currentUser: request.cookies.user })
        }
      })
    }
  })
})

app.get('/review/create/:albumID', (request, response) => {
  const albumID = request.params.albumID
  database.getAlbumsByID( albumID, (error, albums) => {
    let album = albums[0]
    response.render('reviewForm', { album: album, currentUser: request.cookies.user})
  })
})

app.post('/review/create/:albumID', (request, response) => {
  const albumID = request.params.albumID
  const userID = request.cookies.user.id
  const review_text = request.body.review_text

  if( review_text.length === 0 ){
    response.status(406).render('error', { error: new Error("Review must contain some text"), currentUser: request.cookies.user })
  } else {
    database.createReview( albumID, userID, review_text, (error, review) => {
      response.redirect( `/albums/${albumID}`)
    })
  }
})

app.post('/review/delete/:reviewID', (request, response) => {
  const reviewID = request.params.reviewID
  const userID = request.cookies.user.id
  database.deleteReview( reviewID, (error, result) => {
    response.redirect(`/users/${userID}`)
  })
})

app.use((request, response) => {
  response.status(404).render('not_found', {currentUser: request.cookies.user})
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`)
})

const formatDates = function ( list ) {
  return list.map( (item) => {
    item.date = moment( item.created ).format(' dddd, MMMM Do, YYYY')
    return item
  })
}


