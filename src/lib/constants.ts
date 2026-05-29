export const CATEGORIES = [
  "🛒Products",
  "🚌Transport",
  "⚽Entertainment",
  "👗Clothing and shoes",
  "🏥Medicine",
  "📰Utilities and Internet",
  "📨Other",
];

export const CHART_COLORS = [
  "oklch(0.627 0.265 303.9)", // Violet
  "oklch(0.609 0.126 221.72)", // Sky/Blue
  "oklch(0.645 0.246 16.43)",  // Rose/Red
  "oklch(0.769 0.188 70.08)",  // Amber/Orange
  "oklch(0.627 0.194 149.58)", // Emerald
  "oklch(0.707 0.165 254.62)", // Indigo
  "oklch(0.609 0 0)",          // Gray
];

export const EMOJI_REGEX = /[\p{Emoji}\u200d]+/gu;

/**
 * Splits a category name into emoji and text.
 * E.g., "🛒Products" -> { emoji: "🛒", text: "Products" }
 */
export function parseCategory(localizedCategory: string): { emoji: string; text: string } {
  const emojis = localizedCategory.match(EMOJI_REGEX);
  const emoji = emojis?.[0] || "💰";
  const text = localizedCategory.replace(EMOJI_REGEX, "").trim();
  return { emoji, text };
}
export const EMOJIS = [
  "🏠", "👨‍👩‍👧‍👦", "🐱", "🐶", "🦊", "🐻", "🦁", "🦄",
  "🌈", "💼", "🍕", "🎯", "🚀", "💡", "💰", "💎",
  "🎨", "🚗"
];
