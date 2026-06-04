import json

with open("/Users/drnarayanjethwani/Downloads/Website with Antigravity/scratch/dumped_steps.json", "r") as f:
    data = json.load(f)

for step_id, step in data.items():
    print(f"=== STEP {step_id} ===")
    tool_calls = step.get("tool_calls", [])
    for tc in tool_calls:
        print(f"Tool: {tc.get('name')}")
        args = tc.get("args", {})
        if isinstance(args, str):
            try:
                args = json.loads(args)
            except:
                pass
        
        target_file = args.get("TargetFile") or args.get("targetFile")
        print(f"Target File: {target_file}")
        
        if "ReplacementChunks" in args:
            chunks = args["ReplacementChunks"]
            if isinstance(chunks, str):
                try:
                    chunks = json.loads(chunks)
                except:
                    pass
            print(f"ReplacementChunks count: {len(chunks)}, type: {type(chunks)}")
            if len(chunks) > 0:
                print(f"First chunk type: {type(chunks[0])}")
                if isinstance(chunks[0], dict):
                    for idx, c in enumerate(chunks[:5]):
                        print(f"  Chunk {idx}: lines {c.get('StartLine')} to {c.get('EndLine')}")
                        target = c.get("TargetContent", "")
                        repl = c.get("ReplacementContent", "")
                        print(f"    Target length: {len(target)}, Replacement length: {len(repl)}")
                        print(f"    Replacement start: {repr(repl[:120])}")
                else:
                    print(f"First 3 elements: {chunks[:3]}")
        else:
            target = args.get("TargetContent", "") or args.get("targetContent", "")
            repl = args.get("ReplacementContent", "") or args.get("replacementContent", "")
            print(f"  Single Replacement: lines {args.get('StartLine')} to {args.get('EndLine')}")
            print(f"    Target length: {len(target)}, Replacement length: {len(repl)}")
            print(f"    Replacement start: {repr(repl[:120])}")
    print("\n")
