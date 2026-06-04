import re

# Read the file
with open('/Users/drnarayanjethwani/Downloads/Website with Antigravity/src/app/admin/dashboard/page.tsx', 'r') as f:
    content = f.read()

# Pattern for tailwind color classes
# e.g., bg-slate-850, text-rose-250, border-slate-750
pattern = r'\b(bg|text|border|accent|ring|from|to|via|fill|stroke)-([a-z]+)-(\d+)\b'

matches = re.findall(pattern, content)

valid_shades = {'50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'}

invalid_matches = []
for prefix, color, shade in matches:
    if shade not in valid_shades:
        invalid_matches.append((prefix, color, shade))

# Print unique invalid matches
unique_invalid = sorted(list(set(invalid_matches)))
print("Unique invalid Tailwind classes:")
for prefix, color, shade in unique_invalid:
    print(f"  {prefix}-{color}-{shade}")

# Group by shade and color for reporting
print("\nDetailed list with line numbers:")
lines = content.split('\n')
for idx, line in enumerate(lines):
    line_num = idx + 1
    found = re.findall(pattern, line)
    for prefix, color, shade in found:
        if shade not in valid_shades:
            print(f"Line {line_num}: {prefix}-{color}-{shade} | Line content: {line.strip()[:80]}")
