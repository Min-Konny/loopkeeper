// A held Web Lock serializes writers across tabs; no wall-clock lease can race.
export function createSessionOwner({
  locks,
  channel,
  onAcquire,
  onRelease,
  onChange,
}) {
  let owned = false,
    release = null,
    pending = false;
  async function acquire() {
    if (owned || pending || !locks) return false;
    pending = true;
    return new Promise((resolve) => {
      locks
        .request("tomori-save-writer", { ifAvailable: true }, async (lock) => {
          pending = false;
          if (!lock) {
            onChange(false);
            resolve(false);
            return;
          }
          owned = true;
          try {
            onAcquire();
            onChange(true);
            resolve(true);
            await new Promise((r) => (release = r));
          } finally {
            owned = false;
            release = null;
            onChange(false);
          }
        })
        .catch(() => {
          pending = false;
          resolve(false);
        });
    });
  }
  function relinquish() {
    if (!owned) return;
    onRelease();
    owned = false;
    release?.();
    onChange(false);
  }
  if (channel)
    channel.onmessage = (e) => {
      if (e.data === "request-writer") relinquish();
    };
  async function takeover() {
    if (owned) return true;
    channel?.postMessage("request-writer");
    for (let i = 0; i < 20; i++) {
      if (await acquire()) return true;
      await new Promise((r) => setTimeout(r, 100));
    }
    return false;
  }
  return {
    acquire,
    takeover,
    relinquish,
    get owned() {
      return owned;
    },
  };
}
