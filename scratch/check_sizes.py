import json
import os

for fname in ["step_4707_full_args.json", "step_4797_full_args.json", "step_4889_full_args.json", "step_5097_full_args.json"]:
    path = f"/Users/drnarayanjethwani/Downloads/Website with Antigravity/scratch/{fname}"
    if os.path.exists(path):
        size = os.path.getsize(path)
        print(f"{fname}: size {size} bytes")
        with open(path, "r") as f:
            d = json.load(f)
            print(f"  Keys: {list(d.keys())}")
            if "ReplacementChunks" in d:
                chunks = d["ReplacementChunks"]
                if isinstance(chunks, str):
                    try:
                        chunks = json.loads(chunks)
                    except:
                        pass
                print(f"  Chunks: {len(chunks)}")
                if len(chunks) > 0:
                    print(f"  First chunk keys: {list(chunks[0].keys()) if isinstance(chunks[0], dict) else type(chunks[0])}")
            else:
                print("  No ReplacementChunks")
