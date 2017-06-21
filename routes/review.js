const express = require('express')
const database = require('../database')
var router = express.Router()

router.get('/create/:albumID', (request, response) => {
  const albumID = request.params.albumID
  database.getAlbumsByID( albumID, (error, albums) => {
    let album = albums[0]
    response.render('reviewForm', { album: album, currentUser: request.cookies.user})
  })
})

router.post('/create/:albumID', (request, response) => {
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

router.post('/delete/:reviewID', (request, response) => {
  const reviewID = request.params.reviewID
  const userID = request.cookies.user.id
  database.deleteReview( reviewID, (error, result) => {
    response.redirect(`/users/${userID}`)
  })
})

module.exports = router