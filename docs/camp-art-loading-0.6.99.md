# Camp artwork loading — 0.6.99

Current owned stages are loaded on demand in both the camp and battle backdrop. Background/worker images, individual stage images and common facility sheets share promises. Worker atlas construction is reused. Request tokens prevent an obsolete response from replacing the current scene. An existing nearby stage (or temporary building silhouette) remains while a new stage loads. Disposal and visibility guards remain in place.

Shared atlas sheets still transfer their embedded frames together; this change does not split or recompress artwork. Loading failure retains the existing fallback. Failed requests are cached for the page session; reload is the recovery path. Gameplay, time, rewards, difficulty, facility effects, save format and PNG bytes are unchanged.

## Reproducible finite comparison

Isolated headless Chrome; synthetic paused housing III + kitchen II + workshop II; same local cacheable HTTP server, 1000px height, reduced motion. Cold means a fresh browser context; warm means reload in the same context. Constrained network uses 8Mbps throughput/100ms latency. The before server returns the four presentation modules from 0.6.98 Git blobs without restoring the checkout. Times are one observation per condition, not a statistical performance guarantee or physical-phone measurement.

Camp PNG requests: 25 → 5. Cold camp PNG transfer: 48.01 → 9.72MiB (about 80% less). Warm camp PNG body transfer: 0 in both versions. Initial camp visibility is measured separately from game UI attachment.

|Width/network|Cache|Camp ready before|After|
|---|---|---:|---:|
|1280 / local unrestricted|cold|1.502s|0.995s|
|1280 / local unrestricted|warm|0.844s|0.576s|
|390 / local unrestricted|cold|1.639s|1.113s|
|390 / local unrestricted|warm|0.817s|0.565s|
|320 / local unrestricted|cold|1.595s|1.017s|
|320 / local unrestricted|warm|0.784s|0.541s|
|390 / 8Mbps-100ms|cold|85.806s|42.276s|
|390 / 8Mbps-100ms|warm|0.782s|0.726s|

The sample ends 1000ms after camp artwork is ready. An earlier all-network-idle wait timed out because unrelated background MP3 loading remained pending; those incomplete runs are not used as final comparisons. Total application loading is not the same as camp readiness: other action, hero and audio assets remain outside this optimization. The settled 390px camp crop was pixel-identical before/after. This is not a native memory or host-wide performance measurement.

## Validation and remaining scope

149 available unit tests; source syntax/import/bootstrap checks; isolated PC/390/320 normal/reduced-motion stage switching, rapid IV→V requests, return/removal, battle backdrop, disposal, image failures without retry storms, paid construction and save reload, and auto-work scroll/queue/speed regressions. Full unavailable developer suites and physical phones are not claimed. Next artwork batch remains training yard II–V, then regional outposts and non-iron armor variants.
