/**
 * ANSI to HTML/CSS Converter
 * 
 * This script converts ANSI art (with escape codes) to HTML with CSS styling.
 */

// ANSI color codes to CSS mappings
const ANSI_TO_CSS = {
  // Regular colors
  '30': 'color: #000000;', // Black
  '31': 'color: #AA0000;', // Red
  '32': 'color: #00AA00;', // Green
  '33': 'color: #AA5500;', // Yellow/Brown
  '34': 'color: #0000AA;', // Blue
  '35': 'color: #AA00AA;', // Magenta
  '36': 'color: #00AAAA;', // Cyan
  '37': 'color: #AAAAAA;', // White/Light Gray
  
  // Bright/bold colors
  '1;30': 'color: #555555; font-weight: bold;', // Bright Black
  '1;31': 'color: #FF5555; font-weight: bold;', // Bright Red
  '1;32': 'color: #55FF55; font-weight: bold;', // Bright Green
  '1;33': 'color: #FFFF55; font-weight: bold;', // Bright Yellow
  '1;34': 'color: #5555FF; font-weight: bold;', // Bright Blue
  '1;35': 'color: #FF55FF; font-weight: bold;', // Bright Magenta
  '1;36': 'color: #55FFFF; font-weight: bold;', // Bright Cyan
  '1;37': 'color: #FFFFFF; font-weight: bold;', // Bright White
  
  // Background colors
  '40': 'background-color: #000000;', // Black
  '41': 'background-color: #AA0000;', // Red
  '42': 'background-color: #00AA00;', // Green
  '43': 'background-color: #AA5500;', // Yellow/Brown
  '44': 'background-color: #0000AA;', // Blue
  '45': 'background-color: #AA00AA;', // Magenta
  '46': 'background-color: #00AAAA;', // Cyan
  '47': 'background-color: #AAAAAA;', // White/Light Gray
  
  // Other formatting
  '0': '', // Reset
  '1': 'font-weight: bold;', // Bold
  '4': 'text-decoration: underline;', // Underline
};

/**
 * Converts ANSI text to HTML with CSS styling
 * @param {string} ansiText - The ANSI art string with escape codes
 * @return {string} - HTML representation of the ANSI art
 */
function convertAnsiToHtml(ansiText) {
  // Split the text into lines for easier handling
  const lines = ansiText.split('\n');
  let htmlOutput = '<pre class="ansi-art">';
  
  for (const line of lines) {
    // Process each line
    let currentIndex = 0;
    let currentStyle = '';
    let lineHtml = '';
    
    while (currentIndex < line.length) {
      // Check for ANSI escape sequence
      if (line[currentIndex] === '\u001b' && line[currentIndex + 1] === '[') {
        // Find the end of the escape sequence (marked by 'm')
        let endIndex = line.indexOf('m', currentIndex);
        if (endIndex !== -1) {
          // Extract the code part (removing the '\u001b[' prefix and 'm' suffix)
          const code = line.substring(currentIndex + 2, endIndex);
          
          // Close previous span if there was styling
          if (currentStyle) {
            lineHtml += '</span>';
          }
          
          // Find the CSS for this ANSI code
          if (code === '0') {
            // Reset style
            currentStyle = '';
          } else if (ANSI_TO_CSS[code]) {
            // Apply new style
            currentStyle = ANSI_TO_CSS[code];
            lineHtml += `<span style="${currentStyle}">`;
          } else {
            // If we don't recognize the code, just keep the previous style
            if (currentStyle) {
              lineHtml += `<span style="${currentStyle}">`;
            }
            
            // Try to handle composite codes (e.g., "1;31;47")
            const compositeCodes = code.split(';');
            let compositeStyle = '';
            
            for (const subCode of compositeCodes) {
              if (ANSI_TO_CSS[subCode]) {
                compositeStyle += ANSI_TO_CSS[subCode] + ' ';
              }
            }
            
            if (compositeStyle) {
              currentStyle = compositeStyle;
              lineHtml += `<span style="${currentStyle}">`;
            }
          }
          
          // Move past this escape sequence
          currentIndex = endIndex + 1;
          continue;
        }
      }
      
      // Regular character - append to output
      // Replace spaces with &nbsp; to preserve spacing
      const char = line[currentIndex];
      lineHtml += char === ' ' ? '&nbsp;' : escapeHtml(char);
      currentIndex++;
    }
    
    // Close any open span tag
    if (currentStyle) {
      lineHtml += '</span>';
    }
    
    // Add the processed line to the output
    htmlOutput += lineHtml + '\n';
  }
  
  htmlOutput += '</pre>';
  
  // Add CSS for the container
  htmlOutput = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ANSI Art Viewer</title>
  <style>
    body {
      background-color: #121212;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      font-family: monospace;
    }
    .ansi-art {
      line-height: 1.2;
      white-space: pre;
      background-color: #000;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      overflow: auto;
      max-width: 100%;
    }
  </style>
</head>
<body>
  ${htmlOutput}
</body>
</html>`;
  
  return htmlOutput;
}

/**
 * Escapes HTML special characters
 * @param {string} text - The text to escape
 * @return {string} - Escaped text
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, match => map[match]);
}

/**
 * Handles file input for ANSI conversion
 * @param {File} file - The uploaded ANSI file
 * @return {Promise<string>} - Promise resolving to HTML output
 */
function handleFileUpload(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const ansiContent = e.target.result;
      const htmlOutput = convertAnsiToHtml(ansiContent);
      resolve(htmlOutput);
    };
    
    reader.onerror = function() {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Downloads content as a file
 * @param {string} content - The content to download
 * @param {string} filename - The filename to save as
 * @param {string} contentType - The content type (e.g., 'text/html')
 */
function downloadFile(content, filename, contentType) {
  const a = document.createElement('a');
  const file = new Blob([content], {type: contentType});
  
  a.href = URL.createObjectURL(file);
  a.download = filename;
  a.click();
  
  URL.revokeObjectURL(a.href);
}

// Example usage in browser with file input
document.addEventListener('DOMContentLoaded', function() {
  const fileInput = document.getElementById('ansi-file');
  const convertButton = document.getElementById('convert-button');
  const previewDiv = document.getElementById('preview');
  
  convertButton.addEventListener('click', function() {
    if (fileInput.files.length > 0) {
      handleFileUpload(fileInput.files[0])
        .then(html => {
          // Display preview
          previewDiv.innerHTML = 'Preview generated. Click download to save the HTML file.';
          
          // Create download button
          const downloadButton = document.createElement('button');
          downloadButton.textContent = 'Download HTML';
          downloadButton.addEventListener('click', function() {
            downloadFile(html, 'ansi-art.html', 'text/html');
          });
          
          previewDiv.appendChild(document.createElement('br'));
          previewDiv.appendChild(downloadButton);
          
          // Also show a small preview of the converted content
          const iframe = document.createElement('iframe');
          iframe.style.width = '100%';
          iframe.style.height = '400px';
          iframe.style.border = '1px solid #ccc';
          iframe.style.marginTop = '10px';
          
          previewDiv.appendChild(iframe);
          
          // Write the HTML to the iframe
          iframe.contentWindow.document.open();
          iframe.contentWindow.document.write(html);
          iframe.contentWindow.document.close();
        })
        .catch(error => {
          previewDiv.textContent = 'Error: ' + error.message;
        });
    } else {
      previewDiv.textContent = 'Please select an ANSI file to convert.';
    }
  });
});

// For Node.js environments (if using as a script)
if (typeof module !== 'undefined' && module.exports) {
  const fs = require('fs');
  
  // Example command-line usage: node ansi-to-html.js input.ans output.html
  if (process.argv.length >= 4) {
    const inputFile = process.argv[2];
    const outputFile = process.argv[3];
    
    try {
      const ansiContent = fs.readFileSync(inputFile, 'utf8');
      const htmlOutput = convertAnsiToHtml(ansiContent);
      fs.writeFileSync(outputFile, htmlOutput);
      console.log(`Successfully converted "${inputFile}" to "${outputFile}"`);
    } catch (error) {
      console.error('Error:', error.message);
    }
  } else {
    console.log('Usage: node ansi-to-html.js input.ans output.html');
  }
  
  module.exports = {
    convertAnsiToHtml
  };
}