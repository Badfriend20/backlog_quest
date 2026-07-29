import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BacklogQuestApp, browserBacklogStorage, migrateBacklog } from "../../features/backlog";
import defaultBacklogJson from "../../data/backlog.json";
import { GlobalStyles } from "../../shared/ui/tokens/GlobalStyles";
import { PwaUpdatePrompt } from "./PwaUpdatePrompt";

const initialData = migrateBacklog(defaultBacklogJson);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalStyles />
    <BacklogQuestApp initialData={initialData} storage={browserBacklogStorage} />
    <PwaUpdatePrompt />
  </StrictMode>
);
