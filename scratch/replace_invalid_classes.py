import re

replacements = {
    r'\bslate-850\b': 'slate-800',
    r'\bslate-855\b': 'slate-800',
    r'\bslate-750\b': 'slate-700',
    r'\bslate-450\b': 'slate-400',
    r'\bslate-350\b': 'slate-300',
    r'\bslate-205\b': 'slate-200',
    r'\bslate-550\b': 'slate-500',
    r'\bslate-505\b': 'slate-500',
    r'\bslate-250\b': 'slate-200',
    r'\brose-250\b': 'rose-300',
    r'\brose-350\b': 'rose-300',
    r'\brose-450\b': 'rose-400',
    r'\bteal-350\b': 'teal-300',
    r'\bamber-250\b': 'amber-300',
    r'\bamber-305\b': 'amber-300',
    r'\bamber-850\b': 'amber-800'
}

files_to_modify = [
    '/Users/drnarayanjethwani/Downloads/Website with Antigravity/src/app/admin/dashboard/page.tsx',
    '/Users/drnarayanjethwani/Downloads/Website with Antigravity/src/app/store/page.tsx',
    '/Users/drnarayanjethwani/Downloads/Website with Antigravity/src/components/BookingSection.tsx'
]

for file_path in files_to_modify:
    print(f"Modifying {file_path}...")
    with open(file_path, 'r') as f:
        content = f.read()
    
    new_content = content
    for pattern, replacement in replacements.items():
        # Using word boundaries to ensure we don't accidentally match part of a number or longer word
        new_content, count = re.subn(pattern, replacement, new_content)
        if count > 0:
            print(f"  Replaced {pattern} -> {replacement} ({count} times)")
            
    if new_content != content:
        with open(file_path, 'w') as f:
            f.write(new_content)
        print("  File updated successfully.")
    else:
        print("  No changes made.")
