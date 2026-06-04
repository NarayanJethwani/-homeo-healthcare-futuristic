page_path = "/Users/drnarayanjethwani/Downloads/Website with Antigravity/src/app/admin/dashboard/page.tsx"
new_tab6_path = "/Users/drnarayanjethwani/Downloads/Website with Antigravity/scratch/tab6_new.txt"

with open(page_path, "r", encoding="utf-8") as f:
    content = f.read()

with open(new_tab6_path, "r", encoding="utf-8") as f:
    new_tab6 = f.read()

start_marker = '          {/* TAB 6: AI Materia Medica Learning Engine */}'
start_idx = content.find(start_marker)

end_marker = '          {/* 1. New Case Taking Modal */}'
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + new_tab6 + "\n\n" + content[end_idx:]
    with open(page_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Tab 6 replacement successful!")
else:
    print("Failed to find start/end markers in page.tsx!")
