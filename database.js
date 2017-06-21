const pg = require('pg')

const dbName = 'vinyl'
const connectionString = process.env.DATABASE_URL || `postgres://localhost:5432/${dbName}`
const client = new pg.Client(connectionString)

client.connect()

// Query helper function
const query = function(sql, variables, callback){
  console.log('QUERY ->', sql.replace(/[\n\s]+/g, ' '), variables)

  client.query(sql, variables, function(error, result){
    if (error){
      console.log('QUERY <- !!ERROR!!')
      console.error(error)
      callback(error)
    }else{
      console.log('QUERY <-', JSON.stringify(result.rows))
      callback(error, result.rows)
    }
  })
}

const createUser = function( username, email, password, callback ){
  query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *", [username, email, password], callback)
}

const getUserByID = function( userID, callback ) {
  query("SELECT * FROM users WHERE id=$1", [userID], callback)
}

const getUserByEmail = function( email, callback ) {
  query("SELECT * FROM users WHERE email=$1", [email], callback)
}

const getAlbums = function(callback) {
  query("SELECT * FROM albums", [], callback)
}

const getAlbumsByID = function(albumID, callback) {
  query("SELECT * FROM albums WHERE id = $1", [albumID], callback)
}

const getRecentReviews = function(limit, callback){
  query("SELECT reviews.*, albums.title, users.username FROM reviews JOIN albums ON albums.id = reviews.album_id JOIN users ON users.id = reviews.user_id ORDER BY created DESC LIMIT $1", [limit], callback)
}

const getReviewsByAlbum = function(albumID, callback){
  query("SELECT reviews.*, albums.title, users.username FROM reviews JOIN albums ON albums.id = reviews.album_id JOIN users ON users.id = reviews.user_id WHERE album_id = $1 ORDER BY created DESC", [albumID], callback)
}

const getReviewsByUser = function(userID, callback){
  query("SELECT reviews.*, albums.title FROM reviews JOIN albums ON albums.id = reviews.album_id WHERE user_id = $1 ORDER BY created DESC", [userID], callback)
}

const createReview = function( albumID, userID, review_text, callback){
  query("INSERT INTO reviews (album_id, user_id, review_text) VALUES ($1, $2, $3) RETURNING *", [albumID, userID, review_text], callback)
}

const deleteReview = function( reviewID, callback ){
  query("DELETE FROM reviews WHERE id = $1", [reviewID], callback)
}


module.exports = {
  getAlbums,
  getAlbumsByID,
  createUser,
  getUserByID,
  getUserByEmail,
  getRecentReviews,
  getReviewsByAlbum,
  getReviewsByUser,
  createReview,
  deleteReview
}
