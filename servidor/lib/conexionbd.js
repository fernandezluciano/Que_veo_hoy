var mysql   = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  port     : '3306'
  user     : 'root',
  password : '09dic2018',
  database : 'peliculas'
});

module.exports = connection;

