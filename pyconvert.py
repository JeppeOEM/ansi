from ansi2html import Ansi2HTMLConverter
from pathlib import Path

# Get the current script directory
script_dir = Path(__file__).parent

# Define input and output paths
input_path = script_dir / "CODE PROJEKT.ans"
output_path = script_dir / "output.html"

# Read the .ans file
with open(input_path, "r", encoding="utf-8", errors="ignore") as f:
    ansi_content = f.read()

# Convert ANSI to HTML
converter = Ansi2HTMLConverter(inline=True)
html_output = converter.convert(ansi_content, full=False)

# Write the result into an HTML file
with open(output_path, "w", encoding="utf-8") as out:
    out.write(f"<pre>{html_output}</pre>")