const fs = require('fs');
const AnsiToHtml = require('ansi-to-html');
const convert = new AnsiToHtml();

const ansiData = fs.readFileSync('nosauce.utf8ans', 'utf-8');
const htmlContent = convert.toHtml(ansiData);

const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>ANSI Art with Colors</title>
  <style>
    body {
      background: black;
      font-family: monospace;
      white-space: pre-wrap;
    }
  </style>
</head>
<body>
${htmlContent}
</body>
</html>
`;

fs.writeFileSync('ansi.html', fullHtml);
