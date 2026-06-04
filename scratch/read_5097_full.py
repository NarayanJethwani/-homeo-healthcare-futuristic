import json

log_path = "/Users/drnarayanjethwani/.gemini/antigravity/brain/b548e455-5e3c-4e38-a15e-fd3410167b17/.system_generated/logs/transcript.jsonl"
with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            step = json.loads(line)
            if step.get('step_index') == 5097:
                tc = step['tool_calls'][0]
                args = tc['args']
                if isinstance(args, str):
                    args = json.loads(args)
                repl = args.get('ReplacementContent', '')
                print(f"Total length: {len(repl)}")
                print("Ending with ...?", repl.endswith('...'))
                print("Last 100 characters:")
                print(repr(repl[-100:]))
                print("Entire content:")
                print(repl)
        except Exception as e:
            print("Err:", e)
