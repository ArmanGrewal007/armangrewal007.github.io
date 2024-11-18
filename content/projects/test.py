import os
import glob
from pprint import pprint

# Directory and file type setup
dir_name = "certificates"
file_type = "*.pdf"
path = f"{dir_name}/{file_type}"

# Fetch PDF files and strip directory prefix
files = [x.lstrip(f"{dir_name}/") for x in glob.glob(path)]

# Markdown generation logic
output_dir = "markdown_files"  # Directory to save markdown files
os.makedirs(output_dir, exist_ok=True)  # Ensure output directory exists

for file in files:
    try:
    # Extract the date and the remaining filename
        parts = file.split("_", 3)  # Split only up to 3 parts
        date = "_".join(parts[:3])  # Combine the first three parts as the date
        date = date.replace("_", "-")
        title_raw = parts[3] or ""  # The remaining part is the title with .pdf
    except Exception as e:
        print(e)
        import pdb; pdb.set_trace()

    # Remove the .pdf extension and keep underscores
    title = os.path.splitext(title_raw)[0]

    # Format the markdown filename and content
    base_filename = f"{file.rstrip('.pdf')}.md"
    filename = base_filename
    counter = 1

    # Ensure unique filenames if one already exists
    while os.path.exists(os.path.join(output_dir, filename)):
        counter += 1
        filename = f"{title} {counter}.md"

    # Markdown content
    md_content = f"""---
date: '{date}'
title: '{title}'
github: ''
external: 'https://github.com/ArmanGrewal007/Certificates/blob/master/{file}'
tech:
  - xx
company: 'Certificates'
showInProjects: false
---


"""

    # Write markdown file
    with open(os.path.join(output_dir, filename), "w") as md_file:
        md_file.write(md_content)

    print(f"Created: {filename}")
