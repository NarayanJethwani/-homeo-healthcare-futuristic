import json

with open("/Users/drnarayanjethwani/Downloads/Website with Antigravity/scratch/dumped_steps.json", "r") as f:
    data = json.load(f)

step = data.get("5097")
if step:
    print("Step 5097 exists")
    tc = step.get("tool_calls", [])[0]
    args = tc.get("args", {})
    if isinstance(args, str):
        args = json.loads(args)
    print("Keys:", args.keys())
    print("StartLine:", args.get("StartLine"))
    print("EndLine:", args.get("EndLine"))
    print("TargetContent:")
    print(repr(args.get("TargetContent")))
    print("ReplacementContent:")
    print(args.get("ReplacementContent"))
else:
    print("Step 5097 not found")
