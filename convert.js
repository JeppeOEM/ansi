const fs = require('fs');
const iconv = require('iconv-lite');
const Convert = require('ansi-to-html');

// Read and decode the ANSI art file
const buffer = fs.readFileSync('ns2.ans');

// Option 1: Convert to hex representation to see all bytes
// console.log('Hex representation:');
// console.log(buffer.toString('hex').match(/.{1,2}/g).join(' '));

// Option 2: Create a string that shows escape sequences explicitly
const rawString = buffer.toString('binary');
let escapedString = '';
for (let i = 0; i < rawString.length; i++) {
  const charCode = rawString.charCodeAt(i);
  if (charCode < 32 || charCode === 127) { // Control characters
    escapedString += `ESC\\x${charCode.toString(16).padStart(2, '0')}`;
    //console.log(`\\x${charCode.toString(16).padStart(2, '0')}`);
    
  } else {
    escapedString += rawString[i];
  }
}

// Option 3: Your original decoding, for comparison
const content = iconv.decode(buffer, 'cp437');

function process(rawString) {
    const ESC = 'ESC\\x'; // Escape sequence marker
    const result = [];
    let i = 0;
    let currentText = '';
    
    while (i < rawString.length) {
        // Check if we've found an escape sequence
        if (i + ESC.length <= rawString.length && rawString.substring(i, i + ESC.length) === ESC) {
            // If we have accumulated text, push it to result
            if (currentText) {
                result.push({ text: currentText });
                currentText = '';
            }
            
            // Move past the escape sequence
            i += ESC.length;
            
            // Find the next escape sequence or end of string
            let nextEscIndex = rawString.indexOf(ESC, i);
            if (nextEscIndex === -1) {
                // No more escape sequences, grab the rest of the string
                currentText = rawString.substring(i);
                break;
            } else {
                // Get text between this escape and the next one
                currentText = rawString.substring(i, nextEscIndex);
                result.push({ text: currentText });
                currentText = '';
                i = nextEscIndex;
            }
        } else {
            // Not at an escape sequence, add character to current text
            currentText += rawString[i];
            i++;
        }
    }
    
    // Add any remaining text
    if (currentText) {
        result.push({ text: currentText });
    }
    
    return result;
}
let arr = process(content)
console.log(escapedString, "content")
console.log(arr,"arrraayyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
for (let i = 0; i < arr.length; i++){

console.log(i,"$$$$$$$$$$$$$$$$$$$$$$$")   
console.log(arr[i])
}

console.log(content)


const ansiStyles = {
  0:  'reset',
  1:  'bold',
  30: 'color:black',
  31: 'color:red',
  32: 'color:green',
  33: 'color:yellow',
  34: 'color:blue',
  35: 'color:magenta',
  36: 'color:cyan',
  37: 'color:white',
  40: 'background-color:black',
  41: 'background-color:red',
  42: 'background-color:green',
  43: 'background-color:yellow',
  44: 'background-color:blue',
  45: 'background-color:magenta',
  46: 'background-color:cyan',
  47: 'background-color:white',
};

let currentStyle = {
  color: null,
  backgroundColor: null,
  bold: false,
};
