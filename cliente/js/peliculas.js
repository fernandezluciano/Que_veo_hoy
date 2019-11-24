// IP y puerto al que se le realizarán los pedidos. //
var servidor = 'http://localhost:8080';
$(document).ready(function() {
    // Se hace el pedido al backend de todos los géneros para cargalos en el listado de géneros. //
    $.getJSON(servidor + "/generos",
        function(data) {
            for (i = 0; i < data.generos.length; i++) {
                // Se duplica una opción de la lista de selección. //
                var opcion = $(".genero-select option[value='0']").clone();
                // A esa opción se le asigna como valor el id del género, dato que luego va a servir para filtrar por id de género. //
                opcion.attr("value", (data.generos)[i].id);
                // Se le pone el nombre del género al texto de la opción. //
                opcion.html((data.generos)[i].nombre);
                // Se agrega la opción a la lista de selección. //
                $(".genero-select").append(opcion);
            }
        });

    var controladorPeliculas = new ControladorPeliculas();
    // Se le asigna la función buscarPeliculas() al botón de buscar. //
    $('.buscar').click(function() {
        $(".alerta-resultados").hide();
        controladorPeliculas.buscarPeliculas();
    });
    // Se ejecuta la función buscarPeliculas() para cargar la primera página del listado. //
    controladorPeliculas.buscarPeliculas();
});

function ControladorPeliculas() {
    /* Esta función recibe la página y la cantidad de resultados que se quiere mostrar y se encarga de armar el pedido
    que se le va a hacer al backend para obtener las películas */
    this.buscarPeliculas = function(pagina, cantidad) {
            var self = this;
            // Se obtienen los valores por los cuales se va a filtrar. //
            var titulo = $(".titulo-busqueda").val();
            var genero = $(".genero-select option:selected").attr("value");
            var orden = $(".orden-select option:selected").attr("value");
            var anio = $(".anio-busqueda").val();
            
            // Si se recibió como parámetro el número de página, se envía ese valor, si no, se pide la pagina 1. //
            var pagina_solicitada = (pagina) ? pagina : 1;

            // Se crea un objeto que tenga como atributos los parámetros que vamos a pasarle al backend. //
            var query_params = {
                pagina: pagina_solicitada
            };
            // Sólo se envía el parámetro título si hay alguún valor para filtrar por ese campo. //
            if (titulo) {
                query_params.titulo = titulo;
            }

            /* Si el value del género que se seleccionó es igual a 0, significa que se seleccionó la opción
            "Todos". Por eso, si se elige ver todos los géneros, no se envía ese parámetro de filtro. */
            if (genero != 0) {
                query_params.genero = genero;
            }

            // Sólo se envía el parámetro anio si hay algún valor para filtrar por ese campo. //
            if (anio) {
                query_params.anio = anio;
            }

            // Si se recibió como parámetro la cantidad de resultados a mostrar, se envia ese valor, si no, se piden 52 peliculas. //
            query_params.cantidad = (cantidad) ? cantidad : 52;

            /* El value de cada opción de la lista de selección de "Ordenar por" está formado por:
            - Nombre de la columna por la que se va a ordenar - Tipo de orden (descendente o ascendente)
            acá se divide el value de la opción seleccionada en dos campos, la columna orden y el tipo de orden. */
            var orden_array = orden.split("-");
            query_params.columna_orden = orden_array[0];
            query_params.tipo_orden = orden_array[1];

            var query = $.param(query_params);

            // Se hace el pedido al backend de las películas. //
            $.getJSON(servidor + "/peliculas?" + query,
                function(data) {
                    // Se ejecuta la función cargarListado() pasándole como parámetro las películas que se obtuvieron. //
                    self.cargarListado(data.peliculas);
                    // Se ejecuta la función cargarBotones() pasándole el total de películas que se obtienen como resultado. //
                    self.cargarBotones(data.total);
                });
        },

        // Esta función recibe como parámetro todas las películas que se quieren mostrar y se encarga de crear los elementos html correspondientes. //
        this.cargarListado = function(peliculas) {
            // Se vacía el contenedor de las películas. //
            $(".contenedor-peliculas").empty();
            var self = this;
            var cantidad = peliculas.length;
            if (cantidad == 0) {
                // En el caso de no haber resultados, se muestra el alerta. //
                $(".alerta-resultados").show();
            } else {
                for (i = 0; i < cantidad; i++) {
                    // Se clona un elemento que funciona como ejemplo de cómo se van a mostrar las películas por pantalla. //
                    var pelicula = $(".ejemplo-pelicula").clone();
                    // Se cargan los datos de las películas. //
                    pelicula.find(".imagen").attr("src", peliculas[i].poster);
                    pelicula.find(".trama").html(peliculas[i].trama);
                    pelicula.find(".titulo").html(peliculas[i].titulo);
                    pelicula.attr("id", peliculas[i].id);
                    // Cuando se haga click en una película, se va a redirigir la aplicación a la página info.html //
                    pelicula.click(function() {
                        window.location.href = "cliente/html/info.html?id=" + this.id;
                    });
                    // Se agrega la película al contenedor de peliculas. //
                    pelicula.appendTo($(".contenedor-peliculas"));
                    // Esta película no va a ser más de la clase ejemplo-pelicula. //
                    pelicula.removeClass("ejemplo-pelicula");
                    // Se muestra la película que se creó. //
                    pelicula.show();
                }

            }
        },

        /* Esta función recibe como parámetro el total de películas que se obtienen como resultado. Según esa cantidad, 
        crea los botones de la paginación y les da la funcionalidad correspondiente */
        this.cargarBotones = function(total) {
            // Se establece que se van a mostrar 52 resultados por página. //
            var cantidad_por_pagina = 52;
            var self = this;
            /* La cantidad de páginas va a ser el total de resultados que existen dividido la cantidad de resultados que se
            van a mostrar por página. */
            cantidad_paginas = Math.ceil(total / cantidad_por_pagina);
            // Se vacía el contenedor de botones de paginación. //
            $(".btn-group").empty();
            for (i = 0; i < cantidad_paginas; i++) {
                // Se clona un botón de ejemplo. //
                var boton = $(".ejemplo-boton").clone();
                // Le asignamos al botón el número de página. //
                boton.html(i + 1);
                // Le asignamos el atributo número de página. //
                boton.attr("numero-pagina", i + 1);
                // Agregamos el botón al contenedor de botones. //
                boton.appendTo($(".btn-group"));
                // Este botón no va a ser más de la clase ejemplo-boton. //
                boton.removeClass("ejemplo-boton");
                // Se muestra el botón creado. //
                boton.show();
            }
            $(".boton-pagina").click(function() {
                /* Cada botón tiene como funcionalidad buscarPeliculas(). A esta función se le pasa como parámetro
                el atributo "numero-pagina". */
                self.buscarPeliculas($(this).attr("numero-pagina"));
                scroll(0, 0);
            });
        }
}