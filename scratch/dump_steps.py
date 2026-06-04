import json

log_path = "/Users/drnarayanjethwani/.gemini/antigravity/brain/b548e455-5e3c-4e38-a15e-fd3410167b17/.system_generated/logs/transcript.jsonl"
steps = [4707, 4713, 4717, 4797, 4856, 4860, 4889, 5097]

output_data = {}
with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            step = json.loads(line)
            s_idx = step.get('step_index')
            if s_idx in steps:
                output_data[s_idx] = step
        except Exception as e:
            pass

with open("/Users/drnarayanjethwani/Downloads/Website with Antigravity/scratch/dumped_steps.json", "w", encoding="utf-8") as out:
    json.dump(output_data, out, indent=2)

print("Dumped steps successfully!")
