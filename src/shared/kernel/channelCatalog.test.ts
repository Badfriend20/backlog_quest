import { describe, expect, it } from "vitest";
import type { Channel } from "./quest";
import { addChannel } from "./channelCatalog";

describe("addChannel", () => {
  it("crea un canal activo con el nombre limpio", () => {
    const result = addChannel([], "  Steam  ");

    expect(result.channel).toMatchObject({ name: "Steam", active: true });
    expect(result.channels).toEqual([result.channel]);
  });

  it("reutiliza y reactiva un canal existente con el mismo nombre", () => {
    const channels: Channel[] = [{ id: "platform-steam", name: "Steam", active: false }];
    const result = addChannel(channels, " stéam ");

    expect(result.channel).toEqual({ id: "platform-steam", name: "Steam", active: true });
    expect(result.channels).toHaveLength(1);
  });
});
