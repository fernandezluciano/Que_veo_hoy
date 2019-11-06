const con = require('../lib/conexionbd.js');

const buscarTodasLasPeliculas = (req, res) => {
    let sql = "SELECT * FROM pelicula";
    con.query(sql, (error, resultado, fields) => {
        if(error){
            console.log("Hubo un error y no se encontraron las películas.", error.message);
            return res.status(404).send("Hubo un error y no se encontraron las películas.");
        }

        let response = {
            peliculas: resultado
        };

        res.send(response);
    });
}

module.exports = {
    buscarTodasLasPeliculas: buscarTodasLasPeliculas
}