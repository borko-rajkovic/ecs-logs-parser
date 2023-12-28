export const getLastLineThatStartsWithAndHasWord = (
  text: string,
  start: string,
  word: string
) => {
  const lines = text.split("\n");
  const lastLine = lines
    .reverse()
    .map((line, index) => ({ line, index: lines.length - index - 1 }))
    .find(
      (record) => record.line.startsWith(start) && record.line.includes(word)
    );
  return lastLine;
};
