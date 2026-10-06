import os

# Ye kharab nishan aur unka sahi hal
fixes = {
    "Γåù": "→",
    "â€“": "-",
    "â€™": "'",
    "â€œ": '"',
    "â€": '"',
    "â": "",
    "€": "",
    "Â": "",
    "Γ": "",
    "å": "",
    "ù": ""
}

for root, dirs, files in os.walk("."):
    if ".git" in root: continue
    for file in files:
        if file.endswith((".html", ".js", ".css", ".json", ".xml")):
            path = os.path.join(root, file)
            try:
                with open(path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                new_content = content
                for bad, good in fixes.items():
                    new_content = new_content.replace(bad, good)
                if new_content != content:
                    with open(path, "w", encoding="utf-8") as f:
                        f.write(new_content)
                    print(f"Cleaned: {path}")
            except:
                pass

print("Done! All files cleaned.")