export const QUEUE_UNLOCK_WAVE=1;
export const queueUnlocked=s=>s.meta.bestWave>=QUEUE_UNLOCK_WAVE||s.meta.upgrades.includes('action_queue')||(s.version!==1&&(s.meta.freeFeatures||[]).includes('action_queue'));
