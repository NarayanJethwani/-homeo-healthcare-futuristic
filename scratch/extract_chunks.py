import json

with open("/Users/drnarayanjethwani/Downloads/Website with Antigravity/scratch/dumped_steps.json", "r") as f:
    data = json.load(f)

for step_id in ["4707", "4797", "4889", "5097"]:
    step = data.get(step_id)
    if not step:
        continue
    print(f"Extracting step {step_id}")
    tc = step.get("tool_calls", [])[0]
    args = tc.get("args", {})
    if isinstance(args, str):
        try:
            args = json.loads(args)
        except Exception as e:
            print(f"Failed to parse args for {step_id}: {e}")
            continue
    
    with open(f"/Users/drnarayanjethwani/Downloads/Website with Antigravity/scratch/step_{step_id}_full_args.json", "w") as out:
        json.dump(args, out, indent=2)

print("Done extracting!")
