CREATE DATABASE peliculas;
USE peliculas;

CREATE TABLE IF NOT EXISTS genero(
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(30),
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS actor (
    id INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(70),
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS pelicula(
    id INT NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(100),
    duracion INT(5),
    director VARCHAR(400),
    anio INT(5),
    fecha_lanzamiento DATE,
    puntuacion INT(2),
    poster VARCHAR(300),
    trama VARCHAR(700),
    PRIMARY KEY(id),
    genero_id INT NOT NULL,
    FOREIGN KEY (genero_id) REFERENCES genero(id)
);

CREATE TABLE IF NOT EXISTS  actor_pelicula(
    id INT NOT NULL AUTO_INCREMENT,
    actor_id INT NOT NULL,
    pelicula_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (actor_id) REFERENCES actor(id),
    FOREIGN KEY (pelicula_id) REFERENCES pelicula(id)
);

