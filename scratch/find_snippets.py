import json

with open("/Users/drnarayanjethwani/Downloads/Website with Antigravity/scratch/dumped_steps.json", "r") as f:
    data = json.load(f)

for step_id, step in data.items():
    print(f"=== STEP {step_id} ===")
    tool_calls = step.get("tool_calls", [])
    for tc in tool_calls:
        args = tc.get("args", {})
        if isinstance(args, str):
            try:
                args = json.loads(args)
            except:
                pass
        
        args_str = json.dumps(args)
        # Search for key terms: "routerConfig", "telemetryLogs", "settings/ai_router_config", "onSnapshot(doc(db"
        for term in ["routerConfig", "telemetryLogs", "ai_telemetry_logs", "setRouterConfig"]:
            idx = 0
            while True:
                idx = args_str.find(term, idx)
                if idx == -1:
                    break
                print(f"  Found '{term}' at index {idx}:")
                print(f"    {args_str[max(0, idx-100):idx+300]}")
                print("-" * 30)
                idx += len(term)
