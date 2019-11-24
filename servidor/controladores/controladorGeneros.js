const con = require('../lib/conexionbd.js');

// Se realiza la consulta para obtener todos los géneros. //
const obtenerGeneros = (req, res) => {
    let sql = "SELECT * FROM genero";
    con.query(sql, (error, resultado, fields) => {
        if(error){
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta.");
        };

        // Si no hay ninguún error, se crea el objeto respuesta. //
        let response = {
            generos: resultado
        };

        // Se envía la respuesta. //
        res.send(JSON.stringify(response));
    })
};

module.exports = {
    obtenerGeneros: obtenerGeneros
};