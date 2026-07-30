import { createContext, useContext, type ReactNode } from "react";
import type { AppPreferences, VocabularyTerms } from "../kernel/quest";
import { GENERIC_VOCABULARY, resolveVocabulary } from "./vocabulary";

const VocabularyContext = createContext<VocabularyTerms>(GENERIC_VOCABULARY);

export function VocabularyProvider({
  preferences,
  children,
}: Readonly<{ preferences: AppPreferences; children: ReactNode }>) {
  return (
    <VocabularyContext.Provider value={resolveVocabulary(preferences)}>
      {children}
    </VocabularyContext.Provider>
  );
}

export function useVocabulary(): VocabularyTerms {
  return useContext(VocabularyContext);
}
