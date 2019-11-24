const con = require('../lib/conexionbd.js');

const recomendarPelicula = (req, res) => {
    let genero = req.query.genero;
    let puntuacion = req.query.puntuacion;
    let anio_inicio = req.query.anio_inicio;
    let anio_fin = req.query.anio_fin;
    

    let sql = `SELECT pelicula.*, genero.nombre FROM pelicula INNER JOIN genero ON pelicula.genero_id = genero.id WHERE 1=1`; // Query para realizar la consulta. //

    // Se recomienda por género. //
    if(genero){
        sql += ` AND nombre = "${genero}"`
    };

    // Se recomienda por Clásico o Estreno, según los anios pasados como parámetros. //
    if(anio_inicio){
        sql += ` AND anio BETWEEN ${anio_inicio} AND ${anio_fin}`
    };

    // Se recomienda por mejor puntuada. //
    if(puntuacion){
        sql += ` AND puntuacion >= ${puntuacion}`
    };

    // Se realiza la consulta. //
    con.query(sql, (error, resultado, fields) => {
        if (error) {
            console.log("Hubo un error en la consulta.", error.message);
            return res.status(404).send("Hubo un error en la consulta.");
        };

        // Si no hay ningún error, se crea el objeto respuesta. //
        let response = {
            peliculas: resultado
        }

        res.send(JSON.stringify(response));
    })

};

module.exports = {
    recomendarPelicula: recomendarPelicula
};