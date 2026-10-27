# Housing IV/V artwork (0.6.93)

Housing now has distinct authored artwork for all five stages. IV adds a taller central gable and a lower wing; V has a broader twin-gabled communal residence. Oak framing, cream plaster, mossy brown shingles, amber windows, and upper-left lighting follow I–III. Camp footprints remain bounded (IV 58×53, V 58×56 canvas pixels); the source aspect ratio is preserved. Construction cards use the same stage mapping.

Two original PNGs were produced using the built-in image generator, one request per stage. Original received bytes were persisted, decoded, hashed, read back, and visually inspected before integration. Prompts, byte counts, dimensions and SHA256 are in `assets/pixel-v2/ARTWORK-PROVENANCE.json`. No third-party artwork or new library was introduced. I/II/III PNG bytes are unchanged.

Each level's card and camp image falls back independently to the existing level-specific authored SVG when its PNG fails. Failure does not suppress another stage or retry on every render. Existing motion/effects settings, context visibility and cached image loading remain in place.

Validation: all 117 available tests pass; 188 JS modules pass syntax and relative-import checks, inline bootstrap parses. A semantic audit preserves all 202 other source files after cache-tag normalization, including simulation, saves, rewards and UI controls. Forty-nine browser observations cover five levels at 1280/390/320 widths in normal and reduced/effects-off modes, stage-body changes excluding level marks, card art, all five independent missing-image cases and paid III→IV/IV→V completions. Scroll, queue-edit, focus, speed and reload regressions are additionally checked. Synthetic fixtures and isolated desktop Chrome contexts only; physical smartphones and human long-play evaluation are not claimed.

No cost, build time, population, combat, economy, reward, save-schema or normal-36-wave condition changes. Specialist expansion stages and regional camp imagery remain separate unfinished art. The historical single 0.6.92 sequential-QA page crash remains unexplained after a bounded non-reproduction comparison; this visual update does not claim to fix it.
