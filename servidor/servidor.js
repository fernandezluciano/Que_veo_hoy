//Paquetes necesarios para el proyecto
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const controlador = require('./controladores/controlador.js');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//Pedidos para cada ruta
app.get('/peliculas', controlador.buscarTodasLasPeliculas);
app.get('/generos', controlador.buscarGeneros);


//Seteamos el puerto en el cual la aplicación va a escuchar los pedidos
var puerto = '8080';

app.listen(puerto, () => {
  console.log("Escuchando pedidos en el puerto " + puerto);
});

