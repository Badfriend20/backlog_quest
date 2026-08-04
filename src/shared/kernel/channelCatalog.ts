import type { Channel } from "./quest";
import { nextGeneratedId, normalize } from "./questSelectors";

export function addChannel(
  channels: Channel[],
  rawName: string
): { channels: Channel[]; channel: Channel } {
  const name = rawName.trim();
  const existing = channels.find(channel => normalize(channel.name) === normalize(name));

  if (existing) {
    const channel = { ...existing, active: true };
    return {
      channel,
      channels: channels.map(item => (item.id === channel.id ? channel : item)),
    };
  }

  const channel: Channel = {
    id: nextGeneratedId(
      "platform-",
      channels.map(item => item.id)
    ),
    name,
    active: true,
  };
  return { channel, channels: [...channels, channel] };
}
