export function parseThinking(content: string) {
  // Use [\s\S] instead of . to match any character including newlines
  const thinkMatch = content.match(/<think>([\s\S]*?)<\/think>\s*([\s\S]*)/);

  if (!thinkMatch) {
    return { thinking: null, response: content };
  }

  return {
    thinking: thinkMatch[1].trim(),
    response: thinkMatch[2].trim(),
  };
}
