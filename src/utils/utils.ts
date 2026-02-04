export const shorten = (text: string, max: number): string => {
  const words = text.split("");
  if (words.length <= max) {
    return text
  }

  const newWords = words.slice(0, max)
  return newWords.join("") + "..."
}

