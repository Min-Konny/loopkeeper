#!/usr/bin/env bash
set -euo pipefail
# Secret-free boundary test only. The real worker/verifier are not enabled.
image='node:24-bookworm-slim'
root=$(mktemp -d)
trap 'rm -rf "$root"' EXIT
mkdir "$root/candidate" "$root/trusted"
printf 'trusted verifier must stay outside candidate runner\n' > "$root/trusted/verifier.txt"
before=$(sha256sum "$root/trusted/verifier.txt" | cut -d' ' -f1)
export COORDINATOR_SENTINEL='not-a-real-secret-do-not-pass-to-worker'
cat > "$root/candidate/check.cjs" <<'JS'
const assert=require('node:assert/strict');const fs=require('node:fs');const net=require('node:net');const os=require('node:os');
assert.equal(process.getuid(),65534);
assert.equal(process.env.COORDINATOR_SENTINEL,undefined);
assert.equal(fs.existsSync('/trusted/verifier.txt'),false);
assert.throws(()=>fs.writeFileSync('/candidate/tampered','x'),e=>['EROFS','EACCES'].includes(e.code));
assert.throws(()=>fs.writeFileSync('/host-root-write','x'),e=>['EROFS','EACCES'].includes(e.code));
fs.writeFileSync('/tmp/scratch','allowed temporary scratch');
assert(Object.keys(os.networkInterfaces()).every(name=>name==='lo'));
const socket=net.createConnection({host:'1.1.1.1',port:443});
socket.on('connect',()=>{console.error('Unexpected external connection');process.exit(1)});
socket.on('error',e=>{clearTimeout(timer);assert(['ENETUNREACH','EHOSTUNREACH','EACCES'].includes(e.code));console.log('PASS isolation: nonroot, no coordinator env, trusted verifier absent, read-only source/root, temporary scratch, no network');});
const timer=setTimeout(()=>{console.error('Network check did not produce expected denial');process.exit(1)},3000);
JS
chmod 755 "$root" "$root/candidate"
chmod 644 "$root/candidate/check.cjs"
docker pull "$image" >/dev/null
docker image inspect "$image" --format '{{index .RepoDigests 0}}'
image_id=$(docker image inspect "$image" --format '{{.Id}}')
docker run --rm --network none --read-only --cap-drop ALL --security-opt no-new-privileges \
 --pids-limit 64 --memory 128m --cpus 1 --user 65534:65534 \
 --tmpfs /tmp:rw,noexec,nosuid,nodev,size=16m \
 --mount "type=bind,source=$root/candidate,target=/candidate,readonly" \
 "$image_id" node /candidate/check.cjs
after=$(sha256sum "$root/trusted/verifier.txt" | cut -d' ' -f1)
test "$before" = "$after"
echo 'PASS host verifier remains unchanged; no credentials were used'
