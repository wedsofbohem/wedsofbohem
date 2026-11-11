import re

with open("/Users/wedsofbohemmac3/.gemini/antigravity/brain/aa62412f-d0a6-486d-bca6-99bf66fc56e4/.system_generated/steps/120/content.md", "r") as f:
    text = f.read()

# find all image urls in wp-content/uploads/
matches = re.findall(r'https?://[^\s"\'<>]+\.(?:jpg|jpeg|png|webp)', text, re.IGNORECASE)
unique = []
for m in matches:
    # clean trailing punctuation
    clean = m.split('&')[0].rstrip('),;\\')
    if 'wp-content/uploads' in clean and clean not in unique:
        unique.append(clean)

print("Found %d upload images:" % len(unique))
for u in unique:
    print(u)
