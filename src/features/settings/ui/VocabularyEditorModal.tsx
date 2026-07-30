import type { VocabularyTerms } from "../../../shared/kernel/quest";
import { Button, FormGrid, Modal } from "../../../shared/ui";
import { GENERIC_VOCABULARY } from "../../../shared/vocabulary";

const TERM_FIELDS: Array<{
  key: keyof VocabularyTerms;
  label: string;
  help: string;
}> = [
  { key: "activity", label: "Actividad", help: "Registro principal que quieres realizar." },
  { key: "activities", label: "Actividades", help: "Plural del registro principal." },
  { key: "collection", label: "Colección", help: "Vista que reúne todos los registros." },
  { key: "variant", label: "Modalidad", help: "Forma concreta de realizar una actividad." },
  { key: "variants", label: "Modalidades", help: "Plural de modalidad." },
  {
    key: "channel",
    label: "Canal",
    help: "Origen, formato, plataforma o entorno de una modalidad.",
  },
  { key: "channels", label: "Canales", help: "Plural de canal." },
  { key: "accessMethod", label: "Forma de acceso", help: "Cómo obtienes acceso a la modalidad." },
  { key: "resource", label: "Recurso", help: "Equipo, herramienta, espacio o medio utilizado." },
  { key: "resources", label: "Recursos", help: "Plural de recurso." },
  { key: "journey", label: "Recorrido", help: "Ejecución concreta e histórica de una actividad." },
  { key: "journeys", label: "Recorridos", help: "Plural de recorrido." },
  { key: "repetition", label: "Repetición", help: "Nuevo recorrido de algo ya finalizado." },
  { key: "repetitions", label: "Repeticiones", help: "Plural de repetición." },
  { key: "content", label: "Contenido", help: "Parte identificable dentro de una actividad." },
  { key: "contents", label: "Contenidos", help: "Plural de contenido." },
  { key: "mission", label: "Misión", help: "Objetivo activo que puede entrar al plan." },
  { key: "missions", label: "Misiones", help: "Plural de misión." },
  {
    key: "statusPending",
    label: "Estado: pendiente",
    help: "Actividad que todavía no ha comenzado.",
  },
  {
    key: "statusActive",
    label: "Estado: en curso",
    help: "Actividad principal que estás realizando ahora.",
  },
  {
    key: "statusSecondary",
    label: "Estado: curso secundario",
    help: "Actividad en curso con menor prioridad o frecuencia.",
  },
  {
    key: "statusRepeating",
    label: "Estado: repetición",
    help: "Nuevo recorrido de una actividad realizada anteriormente.",
  },
  {
    key: "statusPaused",
    label: "Estado: pausado",
    help: "Actividad iniciada que está temporalmente detenida.",
  },
  {
    key: "statusFinished",
    label: "Estado: terminado",
    help: "Actividad cuyo objetivo principal ya finalizó.",
  },
  {
    key: "statusCompleted",
    label: "Estado: completado",
    help: "Actividad en la que alcanzaste todo lo que te propusiste.",
  },
  {
    key: "statusAbandoned",
    label: "Estado: abandonado",
    help: "Actividad que decidiste no continuar.",
  },
];

export function VocabularyEditorModal({
  value,
  onChange,
  onClose,
}: Readonly<{
  value: Partial<VocabularyTerms>;
  onChange(value: Partial<VocabularyTerms>): void;
  onClose(): void;
}>) {
  return (
    <Modal title="Vocabulario personalizado" eyebrow="LENGUAJE DE LA APLICACIÓN" onClose={onClose}>
      <p>
        Cada término cambia únicamente la presentación. Si lo dejas vacío se usará el valor genérico
        mostrado como ejemplo.
      </p>
      <FormGrid>
        {TERM_FIELDS.map(field => (
          <label key={field.key}>
            <span>{field.label}</span>
            <input
              value={value[field.key] ?? ""}
              placeholder={GENERIC_VOCABULARY[field.key]}
              onChange={event => onChange({ ...value, [field.key]: event.target.value })}
            />
            <small>{field.help}</small>
          </label>
        ))}
      </FormGrid>
      <div className="modal-actions">
        <Button onClick={onClose}>Listo</Button>
      </div>
    </Modal>
  );
}
