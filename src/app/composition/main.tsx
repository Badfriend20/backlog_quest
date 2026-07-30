import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "styled-components";
import { BacklogQuestApp, browserBacklogStorage, migrateBacklog } from "../../features/backlog";
import { getThemeColors } from "../../features/settings";
import defaultBacklogJson from "../../data/backlog.json";
import { GlobalStyles } from "../../shared/ui/tokens/GlobalStyles";
import { PwaUpdatePrompt } from "./PwaUpdatePrompt";

const initialData = migrateBacklog(defaultBacklogJson);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider
      theme={getThemeColors(initialData.preferences.theme, initialData.preferences.customTheme)}
    >
      <GlobalStyles />
      <BacklogQuestApp initialData={initialData} storage={browserBacklogStorage} />
      <PwaUpdatePrompt />
    </ThemeProvider>
  </StrictMode>
);
