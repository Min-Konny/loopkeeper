// No approved track yet. Keep the independent controller for the later replacement.
function createCampAudio() { return null; }
export function createMusicPlayer(factory = createCampAudio) {
  const player = factory();
  if (!player) return { sync() {} };
  player.loop = true;
  player.preload = 'none';
  let unlocked = false, pending = false, denied = false, wanted = false;
  return {
    sync(volume, visible, userGesture = false) {
      if (userGesture) { unlocked = true; denied = false; }
      player.volume = Math.min(1, Math.max(0, volume));
      wanted = unlocked && visible && volume > 0;
      if (!wanted) { player.pause(); return; }
      if (player.paused && !pending && !denied) {
        pending = true;
        Promise.resolve(player.play()).catch(error => { denied = error?.name !== 'AbortError'; }).finally(() => {
          pending = false;
          if (!wanted) player.pause();
        });
      }
    },
  };
}
