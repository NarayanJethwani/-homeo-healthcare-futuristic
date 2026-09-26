# Human Atlas integration

The renderer, anatomy types, download decoder, pointer handling, and exploded layout in this directory were adapted from [ashemag/human-atlas](https://github.com/ashemag/human-atlas) at commit `1c38bf35c254a891200d3cedecfd57abebe83d8d`. The upstream application code is MIT licensed; its license is included here.

The compressed model chunks and manifest in `public/models/human-atlas/` are adapted from the same commit. They contain BodyParts3D 4.0 adult male reference anatomy. The data attribution, source links, license, and adaptation details are in `public/models/human-atlas/ATTRIBUTION.md`.

This integration loads the model when Whole Body Atlas is opened. It uses the original chunked rendering and selection engine inside the Medical Academy layout, with the portal's own system and regional teaching controls.
