export function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');
  const csvRegex = /(".*?"|[^",\n]+)(?=\s*,|\s*$)/g;

  return lines.slice(1).map((line) => {
    const values: string[] = [];
    let match;
    while ((match = csvRegex.exec(line))) {
      values.push(match[0].replace(/(^"|"$)/g, ''));
    }
    const obj: Record<string, string> = {};
    headers.forEach((header, i) => {
      obj[header.trim()] = values[i]?.trim() || '';
    });
    return obj;
  });
}
