export const shorten = (text: string, max: number): string => {
  if (!text) return text;
  const chars = text.split("");
  if (chars.length <= max) return text;
  return chars.slice(0, max).join("") + "...";
};
