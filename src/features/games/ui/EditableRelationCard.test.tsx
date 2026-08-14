import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { EditableRelationCard } from "./EditableRelationCard";

function renderCard(editing: boolean) {
  return renderToStaticMarkup(
    <EditableRelationCard
      editing={editing}
      identifier="COPY-01"
      title="Steam"
      summary={<p>Resumen</p>}
      editor={<div>Editor</div>}
      itemLabel="modalidad"
      deleteMessage="Se eliminará la modalidad."
      onEdit={vi.fn()}
      onRemove={vi.fn()}
      onSave={vi.fn()}
      onDiscard={vi.fn()}
    />
  );
}

describe("EditableRelationCard", () => {
  it("reserva la acción destructiva para el modo edición", () => {
    const readingMarkup = renderCard(false);
    const editingMarkup = renderCard(true);

    expect(readingMarkup).toContain("Editar modalidad");
    expect(readingMarkup).not.toContain("Eliminar modalidad");
    expect(editingMarkup).toContain("Eliminar modalidad");
    expect(editingMarkup).toContain("Cerrar sin guardar");
    expect(editingMarkup).toContain("Guardar y cerrar");
  });
});
