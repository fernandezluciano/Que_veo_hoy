var servidor = 'http://localhost:8080';
$(document).ready(function() {
    var controladorRecomendaciones = new ControladorRecomendaciones();

    // Cuando el documento está listo, se inicializan las preguntas y se le da funcionalidad a los botones. //
    controladorRecomendaciones.inicializarPreguntas();
});

// Se crea el objeto ControladorRecomendaciones. Sus atributos se van a ir seteando a medida que se respondan las preguntas. //
function ControladorRecomendaciones() {
    this.genero = '';
    this.anio_inicio;
    this.anio_fin;
    this.resultados;
    this.puntuacion;
    this.pelicula_actual;

    // Esta funcion crea y les da funcionalidad a los botones (que contienen las distintas respuestas a las preguntas). //
    this.inicializarPreguntas = function() {
        var self = this;
        // se muestra el paso 1. //
        $(".paso-1").show();

        // Al clickear cada botón se debe guardar la información correspondiente que luego va a ser enviada para obtener la recomendación. //
        $(".paso-1 .boton-estreno").click(function() {
            self.anio_inicio = 2005;
            self.anio_fin = 2020;
            self.cargarSegundaPregunta();
        });

        $(".paso-1 .boton-bien-puntuada").click(function() {
            self.puntuacion = 7;
            self.cargarSegundaPregunta();
        });

        $(".paso-1 .boton-clasico").click(function() {
            self.anio_inicio = 1900;
            self.anio_fin = 2005;
            self.cargarSegundaPregunta();
        });

        $(".paso-1 .boton-cualquiera").click(function() {
            self.cargarSegundaPregunta();
        });

        $(".paso-1 .btn-film").click(function() {
            $(".paso-1 .btn-film").removeClass('active');
            $(".paso-1 .btn-film").css('opacity', '.3');
            $(this).addClass('active');
        });

        $(".paso-2-links .pregunta").click(function() {
            self.genero = $(this).attr("genero");
            self.pedirRecomendacion();
        });

        $('.paso-2 select').change(function() {
            self.genero = $(this).attr("genero");
            self.pedirRecomendacion();
        });

        /* Se le asigna funcionalidad al botón "Ver más" que se va a mostrar debajo de la película recomendada.
        Esta función redirige al usuario a la página que muestra mas información de la película según su id. */
        $(".botones-resultado .ver-mas").click(function() {
            var id = (self.pelicula_actual).id;
            window.location.href = "cliente/html/info.html?id=" + id;
            console.log(id);
        });

        // Se le asigna funcionalidad al boton "Otra opción" que se va a mostrar debajo de la película recomendada. //
        // Este botón muestra otra película como recomendación. //
        $(".botones-resultado .otra-opcion").click(function() {
            self.seleccionarPelicula();
        });

        // Se le asigna funcionalidad al botón "Volver" que va a reiniciar la recomendación. //
        $(".botones-resultado .reiniciar, .datos-pelicula-info a.close").click(function() {
            self.reiniciarRecomendacion();
            $(".header-title h1").removeClass('small');
        });

        // Se le asigna funcionalidad al alerta que se muestra cuando no hay más películas para recomendar. //
        $(".alerta-recomendacion .alert-link").click(function() {
            self.reiniciarRecomendacion();
            $(".alerta-recomendacion").hide();
            $(".header-title h1").removeClass('small');
        });
    }

    // Esta función carga la segunda pregunta, es decir, oculta el paso 1 y muestra el paso 2. //
    this.cargarSegundaPregunta = function() {
        $(".paso-2").addClass('active');
        $(".paso-2-links").addClass('active');
    }

    this.pedirRecomendacion = function() {

        var self = this;

        // Se setean los parámetros correspondientes para luego ser enviados al servidor. //
        var query_params = {};

        if (this.genero)
            query_params.genero = this.genero;

        if (this.anio_inicio)
            query_params.anio_inicio = this.anio_inicio;

        if (this.anio_fin)
            query_params.anio_fin = this.anio_fin;

        if (this.puntuacion)
            query_params.puntuacion = this.puntuacion;

        if (Object.keys(query_params).length !== 0) {
            var query = $.param(query_params);
            var ruta = "/peliculas/recomendacion?"
        } else {
            var ruta = "/peliculas/recomendacion";
            var query = "";
        }

        // Se realiza el pedido de recomendación al backend. //
        $.getJSON(servidor + ruta + query,
            function(data) {
                /* La respuesta del backend va a ser un array del películas. Antes de guardar ese array, mezclamos su contenido
                para que no siempre se muestren las películas en el mismo. */
                var peliculas_desordenadas = self.desordenarArray(data.peliculas);
                // Se guardan las películas desordenadas. //
                self.resultados = peliculas_desordenadas;
                // Se ejecuta la función seleccionarPelicula() //
                self.seleccionarPelicula();
            });

    }

    // Esta función se encarga de mostrar una película. //
    this.seleccionarPelicula = function() {
        var cantidad = this.resultados.length;
        // Si no hay más resultados, se ejecuta la función noHayResultados() //
        if (cantidad === 0) {
            this.noHayResultados("No se encontró ninguna película para recomendar");
        } else {
            // Se muestra la primera película del array de resultados. //
            var pelicula_mostrar = this.resultados[0];
            // Esta función elimina el primer resultado para que no vuelva a mostrarse. //
            this.resultados.shift();
            // Se guardan los datos de la película que se está mostrando actualmente. //
            this.pelicula_actual = pelicula_mostrar;
            // Se ejecuta la función mostrarPelicula() pasándole como parámetro la película que debe mostrar. //
            this.mostrarPelicula(pelicula_mostrar);
        }
    }

    // Esta función recibe una película y se encarga de mostrarla. //
    this.mostrarPelicula = function(data) {
        $(".pregunta").hide();
        $(".header-title h1").addClass('small');
        $(".datos-pelicula").show();
        $(".datos-pelicula .imagen").attr("src", data.poster);
        $(".datos-pelicula .trama").html(data.trama);
        $(".datos-pelicula .titulo").html(data.titulo);
        $(".datos-pelicula .genero").html(data.nombre);

    }

    // Esta función se encarga de mostrar el alerta cuando no hay más resultados. //
    this.noHayResultados = function(mensaje) {
        $(".datos-pelicula").hide();
        $(".alerta-recomendacion").show();

    }

    // Esta función se encarga de reiniciar una recomendación. //
    this.reiniciarRecomendacion = function(mensaje) {
            // Se borran los resultados y las respuestas anteriores. //
            this.resultados = [];
            this.anio_fin = "";
            this.anio_inicio = "";
            this.genero = "";
            this.puntuacion = "";
            // Se ocultan los datos de las películas. //
            $(".datos-pelicula").hide();
            // Se muestra el paso 1 de la recomendación. //
            $(".paso-1, .pregunta").show();
        }
        // Esta función se encarga de desordenar un array. //
    this.desordenarArray = function(array) {

        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;

    }

}