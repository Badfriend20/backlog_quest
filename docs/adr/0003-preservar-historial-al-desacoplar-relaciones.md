# Preservar el historial al desacoplar relaciones

Eliminar un contenido, una copia o una partida limpia sus referencias activas, pero no elimina
misiones, partidas históricas ni entradas de actividad relacionadas. Los registros conservan
snapshots descriptivos para seguir explicando el historial. Se eligió el desacoplamiento tolerante
frente al borrado en cascada para no convertir una corrección del catálogo en pérdida de actividad
del usuario.

## Consecuencias

- Crear una relación exige referencias válidas, pero conservarla admite referencias ausentes.
- La UI debe señalar relaciones pendientes y ofrecer acciones para repararlas.
- Las operaciones coordinadas pertenecen a Domain o Application, no a componentes de presentación.
