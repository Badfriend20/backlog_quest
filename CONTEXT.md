# Backlog Quest

Backlog Quest organiza el acceso y la planificación de una colección personal de videojuegos.

## Language

**Plataforma**:
Ecosistema, tienda o familia de versiones a la que pertenece una copia; posee una identidad estable y un nombre configurable.
_Avoid_: Dispositivo, consola

**Propiedad**:
Forma en que se obtiene acceso a una copia dentro de una plataforma.
_Avoid_: Plataforma familiar, biblioteca como forma de acceso

**Dispositivo**:
Equipo físico o entorno concreto donde puede jugarse una copia, como una consola, computadora o portátil.
_Avoid_: Plataforma

**Copia**:
Acceso específico a un juego definido por una plataforma, una propiedad y cero o más dispositivos compatibles. Puede asociarse a partidas y misiones sin determinar su existencia.
_Avoid_: Juego, dispositivo

**Progreso entre copias**:
Compatibilidad que permite continuar una misma partida guardada entre dos o más copias de un juego.
_Avoid_: Progreso del juego, porcentaje general

**Contenido**:
Parte identificable del catálogo de un juego, como una campaña, expansión, DLC, rejugada u objetivo personalizado. El juego administra su identidad y orden; misiones y partidas solamente lo seleccionan.
_Avoid_: Texto libre de misión, partida

**Partida**:
Recorrido concreto de un juego. Requiere una copia y un contenido para registrarse, pero puede conservarse sin esas relaciones si se eliminan posteriormente.
_Avoid_: Porcentaje global del juego

**Misión**:
Objetivo de juego que puede vincularse a un contenido, una copia, un dispositivo, una partida y una agenda. La ausencia posterior de contenido, copia o partida requiere atención, pero no invalida la misión.
_Avoid_: Partida, juego activo

**Sesión programada**:
Combinación recurrente de un día de la semana y una franja dentro de la agenda de una misión. Una misión puede tener cero, una o varias.
_Avoid_: Franja de la misión, día programado aislado

**Franja programada**:
Agrupación visual y editable de una franja única con sus siete activadores semanales. Una misión puede agregar como máximo una agrupación por franja; cada día activo se persiste como una sesión programada.
_Avoid_: Segunda franja duplicada, selector independiente por sesión

**Biblioteca**:
Vista que reúne el catálogo de juegos. En respaldos anteriores, el campo `library` también se usaba
para representar la plataforma de una copia; ese uso se conserva únicamente por compatibilidad.
_Avoid_: Usar biblioteca como sinónimo nuevo de plataforma
