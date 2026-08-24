# OSTM™ 3D Anatomy Assets — Provenance and Review Status

## Scope

This directory contains a mixed development set:

- twenty-five source-verified reference assets spanning all twelve anatomy-system viewers; and
- no procedural anatomy placeholders.

Every asset remains blocked from production medical-education use until a named local anatomical reviewer records the review scope, date, and result. “Source-verified” describes provenance, not local anatomical approval.

## Source-verified reference assets

### Alimentary system — BodyParts3D v4.0

- Viewer file: `digestive/alimentary_system_bodyparts3d_v4.glb`
- BodyParts3D umbrella identifier: FMA7152 / BP9331
- Source: BodyParts3D 4.0 PART-OF tree, 99% polygon-reduction archive
- Creator: The Database Center for Life Science
- Source page: <https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html>
- Derived GLB SHA-256: `39fc6d94fefc59600ac9080f421c354b1d76d502009efcd0eae41302d25f664d`
- Source archive SHA-256: `9fbc713fffeee924a5a657d9813d84d7eb957bded63adb854931dd5e3eb61c97`
- Contents: all 147 alimentary-system surfaces—11 oral, 1 esophageal, 1 gastric, 56 small-intestinal/mesenteric, 11 large-intestinal/mesocolic, 60 hepatic, 3 gallbladder/extrahepatic-duct, and 4 pancreatic surfaces.
- Conversion: `scripts/importBodyParts3DAlimentary.mjs`; official PART-OF memberships, shared coordinates, and source geometry are retained, with stable identifiers, missing normals, and neutral display materials added.

License note: the current BodyParts3D database page states CC BY 4.0, while the downloaded OBJ files embed a CC BY-SA 2.1 Japan notice. This project conservatively applies [CC BY-SA 2.1 Japan](https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en) to the derived alimentary GLB and preserves attribution/share-alike requirements.

### Liver — Human Reference Atlas male v1.0

- Viewer file: `digestive/liver_hra_male_v1.glb`
- Title: 3D Reference Organ for Liver, Male v1.0
- Creator: Kristen Browne (2021)
- Identifier: DOI `10.48539/HBM793.BQGC.274`
- Source page: <https://cdn.humanatlas.io/hra-kg--staging/ref-organ/liver-male/v1.0/>
- License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- SHA-256: `e94f18646d1b8f72cc45b92bdd67bbb4eb71d5bf954888bc8b8f8b52b3940b6a`
- Derivation: source GLB retained without geometry conversion or mesh renaming.

### Pancreas — Human Reference Atlas male v1.0

- Viewer file: `digestive/pancreas_hra_male_v1.glb`
- Title: 3D Reference Organ for Pancreas, Male v1.0
- Creator: Kristen Browne (2021)
- Identifier: DOI `10.48539/HBM249.BLBM.234`
- Source page: <https://cdn.humanatlas.io/hra-kg--staging/ref-organ/pancreas-male/v1.0/>
- License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- SHA-256: `3486e3a4d6f2093460396fb65a907499f1457680156fe80be220a148677138e4`
- Derivation: source GLB retained without geometry conversion or mesh renaming.

### Heart — Human Reference Atlas female v1.1

- Viewer file: `cardiovascular/heart_hra_female_v1_1.glb`
- Title: 3D Reference Organ for Heart, Female v1.1
- Creator: Kristen Browne (2021)
- Identifier: DOI `10.48539/HBM459.GVPS.249`
- Source page: <https://cdn.humanatlas.io/hra-kg--staging/ref-organ/heart-female/v1.1/>
- License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- SHA-256: `a7f85f36cd693eca742c8ed9c7bace42305521d4246db985c2c38e3bd22f3055`
- Contents: 51 source-named meshes covering cardiac chambers, valves, coronary circulation, great vessels, venae cavae, and pulmonary vessels.
- Derivation: source GLB retained without geometry conversion or mesh renaming; the viewer maps source names and embedded ontology identifiers.

The HRA models are described by their publisher as Visible Human-derived reference organs. Their publisher review does not replace application-specific local anatomy review.

### Renal and urinary system — Human Reference Atlas male v1.2

| Viewer file | HRA title | DOI | SHA-256 |
| --- | --- | --- | --- |
| `renal/kidney_hra_male_left_v1_2.glb` | Kidney, Male, Left v1.2 | `10.48539/HBM562.JGPS.244` | `733eef9ec169796196470e538dc248c4397bce0ff7ed679f7b7eb0bb9f185612` |
| `renal/kidney_hra_male_right_v1_2.glb` | Kidney, Male, Right v1.2 | `10.48539/HBM272.ZVPQ.979` | `ff9821e0b8fb7fa6174a07b9cafb9f98bb25feca34ddc0e802beeefb24cd3779` |
| `renal/ureter_hra_male_left_v1_2.glb` | Ureter, Male, Left v1.2 | `10.48539/HBM434.VLQJ.299` | `ebdd493c2e8095ccb6e795f49bf26c94e8d205c94097a7e1f9a9d7b168a1173c` |
| `renal/ureter_hra_male_right_v1_2.glb` | Ureter, Male, Right v1.2 | `10.48539/HBM852.SVFJ.388` | `215978b67cf4d3876249a8dafb8c83a13471b5e1eb601559dca25a61a7c9d091` |
| `renal/urinary_bladder_hra_male_v1_2.glb` | Urinary Bladder, Male v1.2 | `10.48539/HBM722.RMHQ.397` | `070893aea9139d9a2c4f8da3aa66ca309a3c683a599d93a37dd7031c7d71021d` |

- Creators: Kristen Browne and Heidi Schlehlein (2024)
- Source pages: [left kidney](https://cdn.humanatlas.io/hra-kg--staging/ref-organ/kidney-male-left/v1.2/), [right kidney](https://cdn.humanatlas.io/hra-kg--staging/ref-organ/kidney-male-right/v1.2/), [left ureter](https://cdn.humanatlas.io/hra-kg--staging/ref-organ/ureter-male-left/v1.2/), [right ureter](https://cdn.humanatlas.io/hra-kg--staging/ref-organ/ureter-male-right/v1.2/), and [urinary bladder](https://cdn.humanatlas.io/hra-kg--staging/ref-organ/urinary-bladder-male/v1.2/)
- License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- Contents: source-named meshes for bilateral kidney microanatomical regions, paired collecting systems and ureters, and bladder regions/orifices. Each file is shown independently; the viewer does not claim a single assembled urinary model.
- Derivation: source GLBs retained without geometry conversion or mesh renaming.

### Brain — BodyParts3D v4.0

- Viewer file: `nervous/brain_bodyparts3d_v4.glb`
- BodyParts3D identifier: FMA50801 / BP6687
- Source: BodyParts3D 4.0 PART-OF tree, 99% polygon-reduction archive
- Creator: The Database Center for Life Science
- Source page: <https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html>
- Derived GLB SHA-256: `aa408fd4c99f7e38f6815f7f1367ab5948ae64ceef370eee1a746b15283d0365`
- Source archive SHA-256: `9fbc713fffeee924a5a657d9813d84d7eb957bded63adb854931dd5e3eb61c97`
- Contents: 59 elementary source surfaces—19 per cerebral hemisphere, 2 cerebellar, 11 brainstem, and 8 diencephalic/ventricular structures—selected using the official PART-OF terminology and element tables.
- Conversion: `scripts/importBodyParts3DBrain.mjs`; shared source coordinates and geometry are retained, with source identifiers, missing normals, and neutral display materials added for GLB rendering.

The eight deep-brain and ventricular surfaces are presented as an explicitly application-defined viewer grouping rather than a single source-defined anatomical class. The conservative [CC BY-SA 2.1 Japan](https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en) classification and attribution/share-alike requirements used for the BodyParts3D stomach also apply here.

### Respiratory system — Human Reference Atlas male references

| Viewer file | HRA title | DOI | SHA-256 |
| --- | --- | --- | --- |
| `respiratory/lung_hra_male_v1_4.glb` | Lung, Male v1.4 | `10.48539/HBM532.KLZD.394` | `bba95516fa993ac45c3b1c53f32b58d97232ffd78ae56397e5a2589c6ce4903d` |
| `respiratory/main_bronchus_hra_male_v1_1.glb` | Main Bronchus, Male v1.1 | `10.48539/HBM373.XHXV.928` | `1f1f50659daba678a5738af67d4fc8add5a113a744c93427280a19ce9e0c5755` |
| `respiratory/trachea_hra_male_v1_1.glb` | Trachea, Male v1.1 | `10.48539/HBM357.VGJC.676` | `bca5616e505baff61dce1bbc31d6602eb72c112bcbe4531931e37e0c254ddd8d` |

- Creators: Kristen Browne and Heidi Schlehlein (2024)
- Source pages: [lung v1.4](https://cdn.humanatlas.io/hra-kg--staging/ref-organ/lung-male/v1.4/), [main bronchus v1.1](https://cdn.humanatlas.io/hra-kg--staging/ref-organ/main-bronchus-male/v1.1/), and [trachea v1.1](https://cdn.humanatlas.io/hra-kg--staging/ref-organ/trachea-male/v1.1/)
- License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- Contents: the lung model contains bilateral bronchopulmonary segments and intrapulmonary bronchi; HRA publishes the trachea and main bronchi as separate reference organs. The viewer preserves that separation rather than presenting a fabricated assembled airway model.
- Derivation: source GLBs retained without geometry conversion or mesh renaming.

### Whole skeleton — BodyParts3D v4.0

- Viewer file: `skeletal/whole_skeleton_bodyparts3d_v4.glb`
- BodyParts3D identifiers: skeletal system FMA23881 / BP9343; paired free upper limbs FMA24880 / BP9410 and FMA24881 / BP9440; paired free lower limbs FMA24882 / BP9466 and FMA24883 / BP9295
- Source: BodyParts3D 4.0 PART-OF tree, 99% polygon-reduction archive
- Creator: The Database Center for Life Science
- Source page: <https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html>
- Derived GLB SHA-256: `f4a975188000d04ca8cfcf63fe318151eef157d5f299d2b57b456b630e6c631a`
- Source archive SHA-256: `9fbc713fffeee924a5a657d9813d84d7eb957bded63adb854931dd5e3eb61c97`
- Contents: 275 source surfaces—138 axial/girdle surfaces (43 skull, 48 vertebral-column, 41 rib-cage, 2 pelvic, and 4 pectoral-girdle), 77 paired upper-limb surfaces, and 60 paired lower-limb surfaces—classified using the official PART-OF element table.
- Conversion: `scripts/importBodyParts3DSkeleton.mjs`; shared source coordinates and geometry are retained, with source identifiers, missing normals, and neutral display materials added for GLB rendering.

This asset provides the source release's axial and free appendicular bone surfaces. The conservative [CC BY-SA 2.1 Japan](https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en) classification and attribution/share-alike requirements used for the other BodyParts3D derivatives also apply here.

### Endocrine gland collection — BodyParts3D v4.0

- Viewer file: `endocrine/endocrine_glands_bodyparts3d_v4.glb`
- Source umbrella identifier: FMA9668 / BP9654
- Source: BodyParts3D 4.0 PART-OF tree, 99% polygon-reduction archive
- Creator: The Database Center for Life Science
- Source page: <https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html>
- Derived GLB SHA-256: `dc28c455eba7a48690bde7375f20c1d5d3c0f264614dfc46234616da5bf758aa`
- Source archive SHA-256: `9fbc713fffeee924a5a657d9813d84d7eb957bded63adb854931dd5e3eb61c97`
- Contents: pituitary gland, pineal body, bilateral adrenal glands, and four pancreatic surfaces in shared source coordinates.
- Conversion: `scripts/importBodyParts3DEndocrine.mjs`; source geometry is retained, with stable identifiers, missing normals, and neutral display materials added for GLB rendering.

This is an application collection of individually source-mapped structures. Thyroid and parathyroid meshes are deliberately excluded because the selected BodyParts3D release and HRA reference-organ catalog do not provide verified models for them. The conservative [CC BY-SA 2.1 Japan](https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en) classification applies.

### Whole-body skeletal musculature — BodyParts3D v4.0

- Viewer file: `muscular/muscular_system_bodyparts3d_v4.glb`
- BodyParts3D umbrella identifier: FMA5022 / BP7788
- Source: BodyParts3D 4.0 IS-A tree, 99% polygon-reduction archive
- Creator: The Database Center for Life Science
- Source page: <https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html>
- Derived GLB SHA-256: `36135ea4cdce95aa7bc870e9f47becb0def5fcb16e8e5c7a79d532b559fd665a`
- Source archive SHA-256: `40665852c49f218326590e204db91064a1ecfc3c6f8cbd7bbbcaac62c7cd409e`
- Contents: all 323 muscle-organ surfaces—77 head/neck, 76 axial/trunk, 78 upper-limb, and 92 lower-limb meshes—partitioned using the official IS-A element table.
- Conversion: `scripts/importBodyParts3DMuscular.mjs`; shared coordinates and all 2,086,974 triangles are retained. Repeated face vertices are welded into 1,045,335 indexed vertices, normals are recomputed, and source identifiers plus neutral display materials are added.

The axial/trunk and head/neck viewer groupings combine multiple official source branches and are marked as metadata-mapped. This asset covers muscle organs only; it makes no tendon or fascia coverage claim. The conservative [CC BY-SA 2.1 Japan](https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en) classification and attribution/share-alike requirements apply.

### Lymph nodes and lymphoid organs — Z-Anatomy

- Viewer file: `lymphatic/lymphatic_nodes_organs_zanatomy.glb`
- Source file: `LymphoidOrgans100.fbx`, Z-Anatomy `PC-Version` commit `6c7f9016bd5899ac8edafd31b9900c151df42ed6`
- Creator: Z-Anatomy contributors; source lineage includes BodyParts3D by The Database Center for Life Science
- Source page: <https://github.com/LluisV/Z-Anatomy/tree/PC-Version/Resources/Models/FBX>
- Derived GLB SHA-256: `7654362cf7eefcc2661d35fb20245a40fbce23088c39a13a4a27cabf5ebeed49`
- Source FBX SHA-256: `310ff82f502f4f3a79e85f99ddc2009bba9514338119af9edff87b20cf1b3609`
- Contents: 163 named anatomical meshes—42 head/neck nodes, 16 thoracic nodes, 32 abdominal nodes, 28 pelvic nodes, 20 upper-limb nodes, 20 lower-limb nodes, one spleen, two palatine tonsils, and two thymic lobes.
- Conversion: `scripts/importZAnatomyLymphatic.mjs`; all 127,682 source triangles and source transforms are retained. Source hierarchy determines the nine viewer groups; stable identifiers and neutral display materials are added. Empty hierarchy/cross-section helpers and one unplaced demonstration lymph-node object are excluded.

This adapted model is distributed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) with attribution and ShareAlike preserved. It is not a complete lymphatic-network model: the source contains no lymphatic vessels, trunks, ducts, or marrow geometry, and the interface states that limitation explicitly.

### Female reproductive reference organs — Human Reference Atlas

| Viewer file | HRA title/version | DOI | SHA-256 |
| --- | --- | --- | --- |
| `reproductive/uterus_hra_female_v1_2.glb` | Uterus, Female v1.2 | `10.48539/HBM627.VTKD.892` | `41014d2b222c2dbbe8d1cc38206b0099ce76d79659a9fdea9f28b8c7d669b864` |
| `reproductive/ovary_hra_female_left_v1_1.glb` | Ovary, Female, Left v1.1 | `10.48539/HBM499.JLMB.357` | `ed91414a667dec5e4e14aeaa2f8641731f06725dbc914bc0da3dd8b5d77f5062` |
| `reproductive/ovary_hra_female_right_v1_1.glb` | Ovary, Female, Right v1.1 | `10.48539/HBM453.QTZX.449` | `99cc2b91602feacaee08ec1771b993fc0f8b0e32a08bdd7fd6b990a6736aa53b` |
| `reproductive/fallopian_tube_hra_female_left_v1_1.glb` | Fallopian Tube, Female, Left v1.1 | `10.48539/HBM887.HZKB.637` | `5025453048a83c26393b866bc69859a255b4c38816f34ed3a196bfe7d4f33dd1` |
| `reproductive/fallopian_tube_hra_female_right_v1_1.glb` | Fallopian Tube, Female, Right v1.1 | `10.48539/HBM875.FCDP.878` | `17aef41a430e068705dc21ac8ccf746a74f14f47ffc1a31908198b0b026849df` |

- Creators: Kristen Browne and Heidi Schlehlein
- Source pages: [uterus v1.2](https://cdn.humanatlas.io/hra-kg--staging/ref-organ/uterus-female/v1.2/), [left ovary v1.1](https://cdn.humanatlas.io/hra-kg--staging/ref-organ/ovary-female-left/v1.1/), [right ovary v1.1](https://cdn.humanatlas.io/hra-kg--staging/ref-organ/ovary-female-right/v1.1/), [left fallopian tube v1.1](https://cdn.humanatlas.io/hra-kg--staging/ref-organ/fallopian-tube-female-left/v1.1/), and [right fallopian tube v1.1](https://cdn.humanatlas.io/hra-kg--staging/ref-organ/fallopian-tube-female-right/v1.1/)
- License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- Derivation: source GLBs retained without geometry conversion or mesh renaming.

The five female reference organs remain separate assets, following HRA publication boundaries. The viewer does not claim a single assembled female reproductive tract or coverage of the vagina and external genitalia.

### Male reproductive structure collection — BodyParts3D v4.0

- Viewer file: `reproductive/male_reproductive_bodyparts3d_v4.glb`
- Source: BodyParts3D 4.0 IS-A tree, 99% polygon-reduction archive
- Creator: The Database Center for Life Science
- Source page: <https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html>
- Derived GLB SHA-256: `bf64b05ed8cb1591997a2ca1ced3094ca8d19e31891870e3f2bb0ef57fd2f38f`
- Source archive SHA-256: `40665852c49f218326590e204db91064a1ecfc3c6f8cbd7bbbcaac62c7cd409e`
- Contents: bilateral testes, epididymides, deferent ducts, seminal vesicles, prostate, glans penis, corpus spongiosum, and corpus cavernosum—12 official source surfaces in shared coordinates.
- Conversion: `scripts/importBodyParts3DMaleReproductive.mjs`; all 7,184 triangles are retained, repeated face vertices are welded into indexed geometry, normals are recomputed, and source identifiers plus neutral display materials are added.

This male collection remains explicitly separate from the female HRA assets and does not claim complete male pelvic anatomy. The conservative [CC BY-SA 2.1 Japan](https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en) classification applies.

### Skin and modeled hair appendages — BodyParts3D v4.0

- Viewer file: `integumentary/skin_hair_bodyparts3d_v4.glb`
- BodyParts3D identifiers: skin FMA7163 / BP9115; eyebrows FMA54237 / BP8954; head hair FMA54241 / BP8565; pubic hair FMA54319 / BP8350
- Source: BodyParts3D 4.0 IS-A tree, 99% polygon-reduction archive
- Creator: The Database Center for Life Science
- Source page: <https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html>
- Derived GLB SHA-256: `4a75577e511c97cd55adcd22f277ab76dabfc89cdfd9cb28fa4693ebc45ad6df`
- Source archive SHA-256: `40665852c49f218326590e204db91064a1ecfc3c6f8cbd7bbbcaac62c7cd409e`
- Contents: one source-defined whole-body skin envelope plus eyebrow, head-hair, and pubic-hair surfaces in shared coordinates.
- Conversion: `scripts/importBodyParts3DIntegumentary.mjs`; all 232,260 source triangles are retained, repeated face vertices are welded into 116,751 indexed vertices, normals are recomputed, and source identifiers plus neutral display materials are added.

The three hair surfaces are grouped only at the viewer-focus level. The model does not separately segment epidermis, dermis, follicles, sebaceous or sweat glands, nails, or tactile receptors; those structures are therefore not advertised as 3D coverage. The conservative [CC BY-SA 2.1 Japan](https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en) classification applies.

### Ocular structures and external ears — BodyParts3D v4.0

- Viewer file: `sensory/ocular_external_ear_bodyparts3d_v4.glb`
- Source: BodyParts3D 4.0 IS-A tree, 99% polygon-reduction archive
- Creator: The Database Center for Life Science
- Source page: <https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html>
- Derived GLB SHA-256: `e44c4a281085b3d4947ea5a49aecf4372901dafd899fd86657f1021c07066816`
- Source archive SHA-256: `40665852c49f218326590e204db91064a1ecfc3c6f8cbd7bbbcaac62c7cd409e`
- Ocular contents: bilateral anterior chambers, irises, corneas, lenses, sclerae, choroidal surfaces, coronae ciliares, optic retinal regions, and optic-nerve segments—22 source surfaces.
- Auditory contents: one source-defined bilateral external-ear surface, FMA52781 / BP9255.
- Conversion: `scripts/importBodyParts3DSensory.mjs`; all 273,996 source triangles are retained, repeated face vertices are welded into 136,845 indexed vertices, normals are recomputed, and source identifiers plus neutral display materials are added.

The ocular surfaces are grouped bilaterally only at the viewer-focus level. The release does not provide verified auditory-canal, middle-ear, inner-ear, organ-of-Corti, vestibular-labyrinth, or olfactory surfaces; those structures are not presented as modeled anatomy. The conservative [CC BY-SA 2.1 Japan](https://creativecommons.org/licenses/by-sa/2.1/jp/deed.en) classification applies.

## Procedural development placeholders

All registered procedural anatomy placeholders have been retired. Historical builder functions are retained only as development documentation and are excluded from the active build list.

## Promotion gate

Before any model is described as production-ready, the manifest must record verified provenance and licensing, original and derived checksums, reproducible processing, terminology mapping, and named anatomical reviewer approval. Exact machine-readable records are in `ASSET_MANIFEST.json`.
