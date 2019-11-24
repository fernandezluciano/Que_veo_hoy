const con = require('../lib/conexionbd.js');

const obtenerPeliculas = (req, res) => {
    let sql = "SELECT * FROM pelicula WHERE 1=1";

    let anio = req.query.anio; // Anio de realización de la película.
    let titulo = req.query.titulo; // Titulo de la película.
    let genero = req.query.genero; // Género de la peliícula.
    let columna_orden = req.query.columna_orden; // Columna por la que se ordena el resultado.
    let pagina = req.query.pagina; // Número de página.
    let cantidad = req.query.cantidad; // Cantidad de resultados por página.

    let limite = `${(pagina -1) * cantidad}, ${cantidad}`; // Cálculo para cantidad de resultados por página.
    let sqlTotal = "SELECT COUNT(*) AS total FROM pelicula WHERE 1=1"; // Query para obtener total de resultados enviados.
    
    // Se filtra por título y/o género y/o anio. //
    if(titulo){
        sql += ` AND titulo LIKE "\%${titulo}\%"`;
        sqlTotal += ` AND titulo LIKE "\%${titulo}\%"`;
    };

    if(genero){
        sql += ` AND genero_id = ${genero}`;
        sqlTotal += ` AND genero_id = ${genero}`;
    };

    if(anio){
        sql += ` AND anio = ${anio}`;
        sqlTotal += ` AND anio = ${anio}`;
    };

    // Se ordena según el criterio pedido por el usuario. //
    switch(columna_orden){
        case 'titulo':
            sql += ` ORDER BY titulo`
            break;
        case 'anio':
            sql += ` ORDER BY anio DESC`
            break;
        case 'puntuacion':
            sql += ` ORDER BY puntuacion DESC`
            break;
        default:
        break;
    };
    
    // Se limita la cantidad de resultados por página. //
    if(pagina && cantidad){
        sql += ` LIMIT ${limite}`;
    }

    // Se realiza la consulta. //
    con.query(sql, (error, resultado, fields) => {
        if(error){
            console.log("Hubo un error en la consulta.", error.message);
            return res.status(404).send("Hubo un error en la consulta.");
        };

        let response = {
            peliculas: resultado,
            total: ""
        };

        // Se realiza la consulta para obtener total de resultados enviados. //
        con.query(sqlTotal, (errorTotal, resultadoTotal, fieldsTotal) => {
            if (errorTotal){
                    console.log("Hubo un error en la consulta.", errorTotal.message);
                    return res.status(404).send("Hubo un error en la consulta.");
                 };

                 response.total = resultadoTotal[0].total;
                 res.send(JSON.stringify(response));
        });
    });
};

module.exports = {
    obtenerPeliculas: obtenerPeliculas
};
