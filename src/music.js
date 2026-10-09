export const CAMP_TRACKS = ['chill', 'simple', 'simple2', 'up-tempo'];
export function getMusicMode(state) {
  if (['dead', 'cleared', 'legacy_setup'].includes(state.run.status)) return 'silent';
  const enemy = state.run.enemy;
  if (state.run.status === 'combat' && (enemy?.isBoss || enemy?.boss))
    return enemy.wave === 21 ? 'final' : 'boss';
  return 'camp';
}
function createCampAudio() {
  const player = new Audio();
  player.id = 'camp-music';
  player.hidden = true;
  document.body.append(player);
  return player;
}
export function createMusicPlayer(factory = createCampAudio, random = Math.random) {
  const player = factory();
  player.preload = 'none';
  let unlocked = false, pending = false, denied = false, wanted = false;
  let mode = 'camp', current = null, campTrack = null, campTime = 0, bag = [];
  function nextCamp() {
    if (!bag.length) {
      bag = [...CAMP_TRACKS];
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
      if (bag.at(-1) === campTrack) [bag[0], bag[bag.length - 1]] = [bag.at(-1), bag[0]];
    }
    campTrack = bag.pop();
    campTime = 0;
    return campTrack;
  }
  function play() {
    if (!wanted || pending || denied || !player.paused) return;
    pending = true;
    const startedTrack = current;
    // play() can throw synchronously on unsupported platforms.
    let result;
    try { result = player.play(); } catch { denied = true; pending = false; return; }
    Promise.resolve(result).catch(error => {
      if (startedTrack === current) denied = error?.name !== 'AbortError';
    }).finally(() => {
      pending = false;
      if (!wanted) player.pause();
      else if (startedTrack !== current) play();
    });
  }
  function select(track) {
    if (current === track) return;
    player.pause();
    current = track;
    denied = false;
    player.src = new URL(`../assets/music/${track}.mp3`, import.meta.url).href;
    player.loop = mode !== 'camp';
  }
  player.addEventListener('loadedmetadata', () => {
    if (mode === 'camp' && current === campTrack && campTime > 0)
      player.currentTime = Math.min(campTime, Math.max(0, player.duration - .1));
  });
  player.addEventListener('ended', () => {
    if (mode !== 'camp') return;
    select(nextCamp());
    play();
  });
  return {
    sync(volume, visible, userGesture = false, nextMode = mode) {
      if (userGesture) { unlocked = true; denied = false; }
      player.volume = Math.min(1, Math.max(0, volume));
      wanted = unlocked && visible && volume > 0 && nextMode !== 'silent';
      if (mode !== nextMode) {
        if (mode === 'camp' && current === campTrack) campTime = player.currentTime || 0;
        mode = nextMode;
      }
      if (mode !== 'silent') select(mode === 'final' ? 'boss' : mode === 'boss' ? 'EDMboss' : campTrack || nextCamp());
      if (!wanted) { player.pause(); return; }
      play();
    },
  };
}
