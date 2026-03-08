import json
import subprocess
import sys
from pathlib import Path
import yaml

POST_PATH = Path(sys.argv[1])
INDEX_FILE = Path("public/data/signals.json")

def upload_to_ipfs(file_path):
    result = subprocess.run(
        ["ipfs", "add", "-Q", file_path],
        capture_output=True,
        text=True
    )
    return result.stdout.strip()

def parse_post(path):
    content = path.read_text()
    frontmatter, body = content.split('---', 2)[1:]
    meta = yaml.safe_load(frontmatter)
    return meta, body

def update_index(entry):
    if INDEX_FILE.exists():
        data = json.loads(INDEX_FILE.read_text())
    else:
        data = []

    data.append(entry)
    INDEX_FILE.write_text(json.dumps(data, indent=2))

def main():
    meta, body = parse_post(POST_PATH)

    temp_file = Path("temp_post.md")
    temp_file.write_text(body)

    cid = upload_to_ipfs(temp_file)

    entry = {
        "type": meta["type"],
        "title": meta["title"],
        "cid": cid,
        "date": meta["date"]
    }

    update_index(entry)

    print(f"Transmission published. CID: {cid}")

if __name__ == "__main__":
    main()
