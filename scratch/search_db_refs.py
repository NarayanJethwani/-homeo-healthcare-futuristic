import json

log_path = "/Users/drnarayanjethwani/.gemini/antigravity/brain/b548e455-5e3c-4e38-a15e-fd3410167b17/.system_generated/logs/transcript.jsonl"
with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        if "settings/ai_router_config" in line or "ai_telemetry_logs" in line:
            try:
                step = json.loads(line)
                s_idx = step.get('step_index')
                print(f"Match found in step {s_idx}")
                tc = step.get('tool_calls', [])
                for tc_item in tc:
                    name = tc_item.get('name')
                    print(f"  Tool call: {name}")
                    args = tc_item.get('args', {})
                    if isinstance(args, str):
                        try:
                            args = json.loads(args)
                        except:
                            pass
                    # Let's search inside args for content
                    args_str = json.dumps(args)
                    print(f"  Length of args: {len(args_str)}")
                    # Find instances of settings/ai_router_config and print surrounding context
                    idx = args_str.find("settings/ai_router_config")
                    if idx != -1:
                        print(f"  Context in args: {args_str[max(0, idx-200):idx+500]}")
            except Exception as e:
                print("Err:", e)
