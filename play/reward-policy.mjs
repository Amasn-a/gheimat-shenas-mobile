// Scenario B selects the checkpoint by score, never by the largest numerical coin amount.
export const REWARD_POLICY='highest_checkpoint_at_finish';
export function finalCheckpoint(checkpoints,score){return checkpoints.filter(c=>c.requiredCorrect<=score).sort((a,b)=>b.requiredCorrect-a.requiredCorrect)[0]||null;}
