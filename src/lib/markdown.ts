const parse = (markdown: string) => {
  let result = '';
  // trim ...
  const md = markdown.trim();
  // split by lines
  const parts = md.split('\n');
  for (let i = 0; i < parts.length; i++) {
    // get line
    const line = parts[i];
    // check for header
    const header = parseHeader(line);
    if (header) {
      result += header;
      continue;
    }
    // assume its a paragraph
    result += `<p>${line}</p>`
  }
  return result;
}

const parseHeader = (line: string) => {
  const line_parts = line.split(' ');
  const segment = line_parts[0];
  const headers = ['#', '##', '###'];
  const isHeader = headers.includes(segment);
  if (isHeader) {
    const size = headers.indexOf(segment) + 1;
    return `<h${size}>${line_parts.slice(1).join(' ')}</h${size}>`
  }
  return null;
}

const example = `
# this is some markdown

## order list of things
1. first
1. second
1. third

## foods i like
- asparagus
- lemons
- watermelon
- goat milk
- toast
`

const result = parse(example);
console.log({result})
