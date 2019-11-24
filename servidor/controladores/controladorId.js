const con = require('../lib/conexionbd.js');

//Se realiza la consulta para obtener una película según el id pasado como parámetro. //
const obtenerPorId = (req, res) => {
    let id = req.params.id;
    let sqlPelicula = `SELECT * FROM pelicula INNER JOIN genero ON pelicula.genero_id = genero.id WHERE pelicula.id = ${id}`; // Query para obtener datos de película y el género. //

        con.query(sqlPelicula, (error, resultado, fields) => {
            // Se chequea que el id ingresado sea un número. //
            if(typeof Number(id) !== 'number' || isNaN(Number(id))){
                console.log("El id debe ser un número.", error.message);
                return res.status(400).send("El id debe ser un número.");
            };

            if (error) {
                console.log("Hubo un error en la consulta.", error.message);
                return res.status(404).send("Hubo un error en la consulta.");
            }

            if (resultado.length == 0) {
                console.log("No se encontró ninguna película con ese id.")
                return res.status(404).send("No se encontró ninguna película con ese id.");
            }

                // Si no hay ningún error, se crea el objeto respuesta. //
                let response = {
                    pelicula: resultado[0],
                    genero: resultado[0].nombre,
                    actores: ""
                };


    let sqlActores = `SELECT actor.nombre FROM pelicula INNER JOIN actor_pelicula ON pelicula.id=actor_pelicula.pelicula_id INNER JOIN actor ON actor.id = actor_pelicula.actor_id WHERE pelicula.id = ${id}`; // Query para obtener los actores de la película correspondiente. //

        con.query(sqlActores, (error, resultadoActores, fields) => {
            if (error) {
                console.log("Hubo un error en la consulta.", error.message);
                return res.status(404).send("Hubo un error en la consulta.");
            };

                // Se agregan los actores al objeto respuesta. //
                response.actores = resultadoActores;

                // Se envía la respuesta. //
                res.send(JSON.stringify(response));
        });
    })   
};

module.exports = {
    obtenerPorId: obtenerPorId
};