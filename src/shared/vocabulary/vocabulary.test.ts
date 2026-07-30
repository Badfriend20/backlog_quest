import { describe, expect, it } from "vitest";
import type { AppPreferences } from "../kernel/quest";
import { GENERIC_VOCABULARY, activityStatusLabel, resolveVocabulary } from "./vocabulary";

describe("vocabulario", () => {
  it("usa el valor genérico cuando un término personalizado queda vacío", () => {
    const terms = resolveVocabulary({
      vocabularyProfile: "custom",
      customVocabulary: { activity: "", activities: "tareas" },
    } as Pick<AppPreferences, "vocabularyProfile" | "customVocabulary">);

    expect(terms.activity).toBe(GENERIC_VOCABULARY.activity);
    expect(terms.activities).toBe("tareas");
    expect(terms.statusActive).toBe(GENERIC_VOCABULARY.statusActive);
  });

  it("resuelve perfiles predeterminados completos", () => {
    const terms = resolveVocabulary({
      vocabularyProfile: "reading",
      customVocabulary: {},
    } as Pick<AppPreferences, "vocabularyProfile" | "customVocabulary">);

    expect(terms.activity).toBe("libro");
    expect(terms.journey).toBe("lectura");
    expect(Object.values(terms).every(Boolean)).toBe(true);
  });

  it("presenta estados históricos según el tipo de actividad sin modificar el valor guardado", () => {
    const reading = resolveVocabulary({
      vocabularyProfile: "reading",
      customVocabulary: {},
    } as Pick<AppPreferences, "vocabularyProfile" | "customVocabulary">);
    const learning = resolveVocabulary({
      vocabularyProfile: "learning",
      customVocabulary: {},
    } as Pick<AppPreferences, "vocabularyProfile" | "customVocabulary">);
    const gaming = resolveVocabulary({
      vocabularyProfile: "gaming",
      customVocabulary: {},
    } as Pick<AppPreferences, "vocabularyProfile" | "customVocabulary">);

    expect(activityStatusLabel("Jugando", reading)).toBe("Leyendo");
    expect(activityStatusLabel("Rejugando", reading)).toBe("Releyendo");
    expect(activityStatusLabel("En curso", learning)).toBe("Cursando");
    expect(activityStatusLabel("Repitiendo", learning)).toBe("Repasando");
    expect(activityStatusLabel("En curso", gaming)).toBe("Jugando");
    expect(activityStatusLabel("Repitiendo", gaming)).toBe("Rejugando");
    expect(activityStatusLabel("Estado externo", reading)).toBe("Estado externo");
  });
});
