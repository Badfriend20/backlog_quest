import type { VocabularyProfileId } from "../../../shared/kernel/quest";

export interface ExampleDatasetDefinition {
  id: string;
  profile: VocabularyProfileId;
  label: string;
  description: string;
  fileName: string;
}

export const EXAMPLE_DATASETS: ExampleDatasetDefinition[] = [
  {
    id: "generic",
    profile: "generic",
    label: "Actividades variadas",
    description: "Mezcla de hábitos, experiencias, tareas y planes con lenguaje neutral.",
    fileName: "backlog-quest-ejemplo-generico.json",
  },
  {
    id: "gaming",
    profile: "gaming",
    label: "Videojuegos",
    description: "Bibliotecas, copias, dispositivos, partidas, contenidos y rejugadas.",
    fileName: "backlog-quest-ejemplo-videojuegos.json",
  },
  {
    id: "reading",
    profile: "reading",
    label: "Lectura",
    description: "Libros, ediciones, formatos, lecturas y secciones.",
    fileName: "backlog-quest-ejemplo-lectura.json",
  },
  {
    id: "learning",
    profile: "learning",
    label: "Aprendizaje",
    description: "Cursos, módulos, plataformas, sesiones y recorridos formativos.",
    fileName: "backlog-quest-ejemplo-aprendizaje.json",
  },
  {
    id: "projects",
    profile: "projects",
    label: "Proyectos",
    description: "Proyectos, entregables, herramientas, ciclos y objetivos activos.",
    fileName: "backlog-quest-ejemplo-proyectos.json",
  },
  {
    id: "custom-cooking",
    profile: "custom",
    label: "Personalizado: cocina",
    description: "Ejemplo de vocabulario propio aplicado a recetas, versiones y preparaciones.",
    fileName: "backlog-quest-ejemplo-personalizado-cocina.json",
  },
];
