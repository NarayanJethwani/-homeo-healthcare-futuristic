import json

log_path = "/Users/drnarayanjethwani/.gemini/antigravity/brain/b548e455-5e3c-4e38-a15e-fd3410167b17/.system_generated/logs/transcript.jsonl"

steps = [4707, 4713, 4717, 4797, 4856, 4860, 4889, 5097]

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            step = json.loads(line)
            s_idx = step.get('step_index')
            if s_idx in steps:
                tool_calls = step.get('tool_calls', [])
                for tc in tool_calls:
                    args_raw = tc.get('args', '')
                    args_len = len(args_raw) if isinstance(args_raw, str) else len(json.dumps(args_raw))
                    print(f"Step {s_idx} tool call: {tc.get('name')}, args raw length: {args_len}")
                    # check if the text has "..." at the end or seems truncated
                    if isinstance(args_raw, str):
                        print(f"Ends with ...: {args_raw.endswith('...') or 'truncated' in args_raw}")
                        print(f"First 100 chars: {args_raw[:100]}")
                        print(f"Last 100 chars: {args_raw[-100:]}")
                    print("-" * 50)
        except Exception as e:
            pass
