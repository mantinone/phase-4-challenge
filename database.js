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

const getUserById = function( userId, callback ) {
  query("SELECT * FROM users WHERE id=$1", [userId], callback)
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

module.exports = {
  getAlbums,
  getAlbumsByID,
  createUser,
  getUserById,
  getUserByEmail
}
