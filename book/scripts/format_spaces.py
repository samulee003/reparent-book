import os
import glob
import pangu

def format_directory(directory):
    md_files = glob.glob(os.path.join(directory, "*.md"))
    for file_path in md_files:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Pangu spacer
        new_content = pangu.spacing_text(content)
        
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Formatted: {file_path}")

if __name__ == "__main__":
    format_directory("02_contents")
