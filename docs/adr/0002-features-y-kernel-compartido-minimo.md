# Organizar por features y mantener un kernel compartido mínimo

Cada feature es propietaria de su comportamiento y puede contener sus propias capas `domain`,
`application`, `infrastructure` y `ui`. `shared` acepta únicamente contratos o módulos estables con
consumidores reales en más de una feature; las mutaciones que coordinan relaciones cruzadas pasan
por `backlog/application`. Se eligió esta estructura frente a capas técnicas globales para
concentrar cambios y evitar dependencias implícitas entre vistas.

## Consecuencias

- Los consumidores externos importan desde la interfaz pública de cada feature.
- Una abstracción compartida requiere al menos dos consumidores con la misma semántica.
- Se permite duplicación pequeña de presentación cuando extraerla mezclaría conceptos distintos.
