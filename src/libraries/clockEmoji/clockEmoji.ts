export default function getClockEmoji(date?: Date | null) {
  if (!date) date = new Date();

  const hour = date.getHours();
  const minutes = date.getMinutes();

  switch (hour) {
    case 0:
    case 12:
      return minutes < 15 || minutes > 45 ? "\u{1F55B}" : "\u{1F567}";
    case 1:
    case 13:
      return minutes < 15 || minutes > 45 ? "\u{1F550}" : "\u{1F55C}";
    case 2:
    case 14:
      return minutes < 15 || minutes > 45 ? "\u{1F551}" : "\u{1F55D}";
    case 3:
    case 15:
      return minutes < 15 || minutes > 45 ? "\u{1F552}" : "\u{1F55E}";
    case 4:
    case 16:
      return minutes < 15 || minutes > 45 ? "\u{1F553}" : "\u{1F55F}";
    case 5:
    case 17:
      return minutes < 15 || minutes > 45 ? "\u{1F554}" : "\u{1F560}";
    case 6:
    case 18:
      return minutes < 15 || minutes > 45 ? "\u{1F555}" : "\u{1F561}";
    case 7:
    case 19:
      return minutes < 15 || minutes > 45 ? "\u{1F556}" : "\u{1F562}";
    case 8:
    case 20:
      return minutes < 15 || minutes > 45 ? "\u{1F557}" : "\u{1F563}";
    case 9:
    case 21:
      return minutes < 15 || minutes > 45 ? "\u{1F558}" : "\u{1F564}";
    case 10:
    case 22:
      return minutes < 15 || minutes > 45 ? "\u{1F559}" : "\u{1F565}";
    case 11:
    case 23:
      return minutes < 15 || minutes > 45 ? "\u{1F55A}" : "\u{1F566}";
    default:
      return "\u{1F552}";
  }
}
