const fs = require('fs');
const iconv = require('iconv-lite');
const Convert = require('ansi-to-html');

// Read and decode the ANSI art file
const buffer = fs.readFileSync('ns.ans');
const content = iconv.decode(buffer, 'cp437');

// Convert ANSI to HTML
const convert = new Convert();
let htmlContent = convert.toHtml(content);

// Wrap in a full HTML document
let fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ANSI Art</title>
  <style>
    body { background: black; color: white; font-family: monospace; white-space: pre; }
  </style>
</head>
<body>
${htmlContent}
</body>
</html>
`;

// Write the output to an HTML file
fs.writeFileSync('output.html', fullHtml);
console.log('HTML file created: output.html');
