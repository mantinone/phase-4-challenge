const express = require('express')
const moment = require('moment')
const database = require('../database')
var router = express.Router()

router.get('/', (request, response) => {
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

router.get('/users/:userID', (request, response) => {
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

router.get('/albums/:albumID', (request, response) => {
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

const formatDates = function ( list ) {
  return list.map( (item) => {
    item.date = moment( item.created ).format(' dddd, MMMM Do, YYYY')
    return item
  })
}

module.exports = router