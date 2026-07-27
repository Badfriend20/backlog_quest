export function EmptyCard({
  title,
  text,
  action,
  onAction,
}: {
  title: string;
  text: string;
  action: string;
  onAction(): void;
}) {
  return (
    <article className="game-card empty-card">
      <h3>{title}</h3>
      <p>{text}</p>
      <button type="button" className="primary-button compact" onClick={onAction}>
        {action}
      </button>
    </article>
  );
}
