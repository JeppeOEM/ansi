const fs = require('fs');
const iconv = require('iconv-lite');

// Read and decode the ANSI art file
const buffer = fs.readFileSync("LINKS WIP.ans");
var Convert = require('ansi-to-html');
var convert = new Convert();

// Option 1: Convert to hex representation to see all bytes
// console.log('Hex representation:');
// console.log(buffer.toString('hex').match(/.{1,2}/g).join(' '));

// Option 2: Create a string that shows escape sequences explicitly
const rawString = buffer.toString('binary');
let escapedString = '';
for (let i = 0; i < rawString.length; i++) {
  const charCode = rawString.charCodeAt(i);
  if (charCode < 32 || charCode === 127) { // Control characters
    escapedString += `\\x${charCode.toString(16).padStart(2, '0')}`;
    //console.log(`\\x${charCode.toString(16).padStart(2, '0')}`);

  } else {
    escapedString += rawString[i];
  }
}

// Option 3: Your original decoding, for comparison
const content = iconv.decode(buffer, 'cp437');

let html = convert.toHtml(content);
console.log("HTML FUUUU")
console.log(html)


const finalHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ANSI Art</title>
  <style>
    body {
      background-color: green;
      color: white;
      font-family: monospace;
      white-space: pre;
      padding: 20px;
    }

    #ansi-art span {
    background-color: black;
    }
  </style>
</head>
<body>
  <div id="ansi-art">
    ${html}
  </div>
</body>
</html>
`;

fs.writeFileSync('output.html', finalHtml);


